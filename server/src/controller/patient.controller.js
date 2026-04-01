import redis from "../db/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Appointments from "../models/Appointments.model.js";
import Doctors from "../models/Doctors.model.js";
import crypto from "crypto";
import QRCode from "qrcode";

// convert "10:30" -> minutes
const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

// convert minutes -> "10:30"
const minutesToTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Get day string
const getDayName = (date) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
};

export const addAppointment = AsyncHandler(async (req, res) => {
    const patientId = req.user._id;
    const { doctorId } = req.body;

    if (!doctorId) {
        throw new ApiErrors(400, "doctorId is required");
    }

    const redisKey = `Doctor:${doctorId}`
    const redisDoctor = await redis.get(redisKey)

    let doctor
    if (redisDoctor) {
        doctor = JSON.parse(redisDoctor)
    } else {
        doctor = await Doctors.findById(doctorId)
            .populate({
                path: 'userId',
                select: '-password -image.publicId'
            })
            .populate('departmentId')
            .lean()

        if (!doctor) {
            throw new ApiErrors(404, 'doctor not found')
        }

        await redis.set(
            redisKey,
            JSON.stringify(doctor),
            "EX", 600
        )
    }

    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    const existingAppointment = await Appointments.findOne({
        doctorId,
        patientId,
        status: { $in: ["Booked", "Pending"] },
        date: {
            $gte: now,
            $lte: next7Days
        }
    });

    if (existingAppointment) {
        throw new ApiErrors(400, 'Already Booked this Doctor')
    }

    const slotDuration = doctor.slotDuration;

    let foundSlot = null;
    let selectedDate = null;

    // Loop next 7 days
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        currentDate.setHours(0, 0, 0, 0);

        const dayName = getDayName(currentDate);

        // find schedule for that day
        const schedule = doctor.schedule.find(
            (s) => s.dayOfWeek === dayName
        );

        if (!schedule) continue;

        // generate slots
        let start = timeToMinutes(schedule.startTime);
        const end = timeToMinutes(schedule.endTime);

        const slots = [];

        while (start + slotDuration <= end) {
            const slotStart = minutesToTime(start);
            const slotEnd = minutesToTime(start + slotDuration);

            slots.push({ slotStart, slotEnd });
            start += slotDuration;
        }

        // get already booked slots
        const booked = await Appointments.find({
            doctorId,
            date: currentDate,
            status: "Booked"
        }).select("slotStart");

        const bookedSet = new Set(booked.map(b => b.slotStart));

        // find first free slot
        for (const slot of slots) {
            if (!bookedSet.has(slot.slotStart)) {
                foundSlot = slot;
                selectedDate = currentDate;
                break;
            }
        }

        if (foundSlot) break;
    }

    if (!foundSlot) {
        throw new ApiErrors(400, "No available slots in next 7 days");
    }

    // Create appointment
    const qrHash = crypto.randomBytes(16).toString("hex");

    let appointment;
    try {
        appointment = await Appointments.create({
            patientId,
            doctorId,
            date: selectedDate,
            slotStart: foundSlot.slotStart,
            slotEnd: foundSlot.slotEnd,
            status: "Booked",
            qrHash
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiErrors(400, "Slot just got booked, try again");
        }
        throw error;
    }

    // Generate QR
    const qrPayload = `${process.env.CORS_ORIGIN}/receptionist/check-in?appointmentId=${appointment._id}&hash=${qrHash}`;

    const qrImage = await QRCode.toDataURL(qrPayload);

    await redis.del(`appointmentHistory:${patientId}`)

    return res
        .status(201)
        .json(
            new ApiResponse(201, {
                appointment,
                qrImage
            }, "Appointment auto-assigned"));
});

export const appointmentHistory = AsyncHandler(async (req, res) => {
    const patientId = req.user._id

    let appointmentHistory
    const redisKey = `appointmentHistory:${patientId}`
    const redisAppointmentHistory = await redis.get(redisKey)

    if (redisAppointmentHistory) {
        appointmentHistory = JSON.parse(redisAppointmentHistory)
    } else {
        appointmentHistory = await Appointments
            .find({ patientId })
            .populate({
                path:"doctorId",
                select: "userId",
                populate: {
                    path: "userId",
                    select: "-image.publicId -password"
                }
            })
            .sort({ createdAt: -1 })

        await redis.set(redisKey,
            JSON.stringify(appointmentHistory),
            "EX", 600
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, appointmentHistory, "appointment history fetch successful")
        )
})

export const getAppointment = AsyncHandler(async(req, res)=>{
    const {appointmentId} = req.params
    const patientId = req.user._id

    if (!appointmentId) {
        throw new ApiErrors(200, "appointmentId is required")
    }

    const redisKey = `appointment:${appointmentId}`
    let appointment

    const redisAppointment = await redis.get(redisKey)
    if (redisAppointment) {
        appointment = JSON.parse(redisAppointment)
    } else {
        appointment = await Appointments.findById(appointmentId)
        if (!appointment) {
            throw new ApiErrors(404, "appointment is not found")
        }

        if (appointment.patientId.toString() !== patientId.toString()) {
            throw new ApiErrors(401, "unauthorized access")
        }

        await redis.set(redisKey,
            JSON.stringify(appointment),
            "EX", 300
        )
    }

    const qrPayload = `${process.env.CORS_ORIGIN}/receptionist/check-in?appointmentId=${appointment._id}&hash=${appointment.qrHash}`;

    const qrImage = await QRCode.toDataURL(qrPayload);

    return res
        .status(200)
        .json(
            new ApiResponse(200, {appointment, qrImage}, "appointment get done")
        )
})