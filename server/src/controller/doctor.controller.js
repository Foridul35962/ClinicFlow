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

    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cached), "Dashboard (cached)")
        );
    }

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

    const completedAppointments = await Appointments.find({
        doctorId: doctor._id,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Done"
    });

    const income = completedAppointments.reduce((sum) => {
        return sum + (doctor.consultationFee || 0);
    }, 0);

    // skip exclude
    const queueData = await Appointments.find({
        doctorId: doctor._id,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Pending",
        isSkipped: { $ne: true }
    })
        .populate({
            path: "patientId",
            select: "fullName email phoneNumber"
        })
        .sort({ tokenNumber: 1 });

    const currentAppointment = queueData.length > 0 ? queueData[0] : null;
    const currentToken = currentAppointment ? currentAppointment.tokenNumber : 0;

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
            currentAppointment,
            nextPatients
        }
    };

    await redis.set(cacheKey, JSON.stringify(dashboardData), "EX", 300);

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Doctor dashboard fetched")
    );
});

export const callNextPatient = AsyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (req.user.role !== "doctor") {
        throw new ApiErrors(401, "Unauthorized");
    }

    const doctor = await Doctors.findOne({ userId });
    if (!doctor) {
        throw new ApiErrors(404, "Doctor not found");
    }

    const result = await moveToNextPatient(doctor._id);

    await redis.del(`dashboard:${doctor._id}`);

    return res.status(200).json(
        new ApiResponse(200, result, "Next patient called")
    );
});

export const completeAppointment = AsyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const doctorId = req.user._id

    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
        throw new ApiErrors(404, "Appointment not found");
    }

    if (doctorId.toString() !== appointment.doctorId.toString()) {
        throw new ApiErrors(401, 'unauthorized access')
    }

    if (appointment.status !== "Pending") {
        throw new ApiErrors(400, "Invalid appointment status");
    }

    appointment.status = "Done";
    await appointment.save();

    // move next
    const result = await moveToNextPatient(appointment.doctorId);

    await redis.del(`dashboard:${appointment.doctorId}`);

    return res.status(200).json(
        new ApiResponse(200, result, "Appointment completed & next called")
    );
});

const moveToNextPatient = async (doctorId) => {

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const queue = await Appointments.find({
        doctorId,
        date: { $gte: todayStart, $lte: todayEnd },
        status: "Pending",
        isSkipped: { $ne: true }
    })
        .populate({
            path: "patientId",
            select: "fullName email phoneNumber"
        })
        .sort({ tokenNumber: 1 });

    if (queue.length <= 1) {
        return {
            skippedToken: queue[0]?.tokenNumber || null,
            nextToken: null
        };
    }

    const current = queue[0];

    current.isSkipped = true;
    await current.save();

    return {
        skippedToken: current.tokenNumber,
        nextToken: queue[1].tokenNumber,
        currentAppointment: queue[1]
    };
};