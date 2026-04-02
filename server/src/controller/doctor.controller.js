import redis from "../db/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Appointments from "../models/Appointments.model.js";
import Doctors from "../models/Doctors.model.js";

export const doctorDashboard = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (req.user.role !== 'doctor') {
        throw new ApiErrors(401, "unauthorized access")
    }

    const doctor = await Doctors.findOne({ userId });
    if (!doctor) {
        throw new ApiErrors(404, "doctor not found");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const cacheKey = `dashboard:${doctor._id}`;

    // Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cached), "Dashboard (cached)")
        );
    }

    // Aggregation
    const stats = await Appointments.aggregate([
        {
            $match: {
                doctorId: doctor._id,
                date: { $gte: todayStart, $lte: todayEnd }
            }
        },
        {
            $group: {
                _id: null,
                totalAppointments: { $sum: 1 },
                completed: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Done"] }, 1, 0]
                    }
                },
                cancelled: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0]
                    }
                },
                waiting: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
                    }
                },
                notArrived: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "Booked"] }, 1, 0]
                    }
                }
            }
        }
    ]);

    const result = stats[0] || {
        totalAppointments: 0,
        completed: 0,
        cancelled: 0,
        waiting: 0,
        notArrived: 0
    };

    // Income (Done only)
    const completedAppointments = await Appointments.find({
        doctorId: doctor._id,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Done"
    });

    const income = completedAppointments.reduce((sum, a) => {
        return sum + (doctor.consultationFee || 0);
    }, 0);

    // Queue (Pending = checked-in)
    const queueData = await Appointments.find({
        doctorId: doctor._id,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Pending"
    }).sort({ tokenNumber: 1 });

    // First pending = current serving
    const currentToken = queueData.length > 0 ? queueData[0].tokenNumber : 0;

    const lastToken = queueData.length > 0
        ? queueData[queueData.length - 1].tokenNumber
        : 0;

    const nextPatients = queueData
        .slice(1, 6)
        .map(a => a.tokenNumber);

    const dashboardData = {
        stats: {
            ...result,
            income
        },
        queue: {
            currentToken,
            lastToken,
            nextPatients
        }
    };

    await redis.set(cacheKey, JSON.stringify(dashboardData), "EX", 300);

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Doctor dashboard fetched")
    );
});