import redis from "../db/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Appointments from "../models/Appointments.model.js";

export const checkInPatient = AsyncHandler(async (req, res) => {
    const { appointmentId, hash } = req.body
    if (!appointmentId || !hash) {
        throw new ApiErrors(400, 'all field are required')
    }

    const appointment = await Appointments.findById(appointmentId)
    if (!appointment) {
        throw new ApiErrors(404, "appointment is not found")
    }

    if (appointment.qrHash.toString() !== hash) {
        throw new ApiErrors(400, "Invalid QR")
    }

    if (appointment.checkedIn) {
        throw new ApiErrors(400, "patient are already checkedIn")
    }

    const today = new Date();
    if (appointment.date.toDateString() !== today.toDateString()) {
        throw new ApiErrors(400, "Appointment is not today");
    }

    const lastToken = await Appointments.find({ doctorId: appointment.doctorId, date: appointment.date, checkedIn: true })
        .sort({ tokenNumber: -1 })
        .limit(1);
    appointment.tokenNumber = lastToken.length ? lastToken[0].tokenNumber + 1 : 1;
    appointment.checkedIn = true;

    appointment.status = "Pending"
    await appointment.save();

    await redis.del(`appointment:${appointmentId}`)
    await redis.del(`dashboard:${appointment.doctorId}`);

    const io = req.app.get('io')

    io.to(`user:${appointment.patientId}`)
        .emit('appointmentStatusUpdate', { status: 'Pending' })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Patient CheckIn Successfully")
        )
})

export const recallPatient = AsyncHandler(async (req, res) => {
    const { appointmentId } = req.body;

    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
        throw new ApiErrors(404, "Appointment not found");
    }

    if (!appointment.isSkipped) {
        throw new ApiErrors(400, "Patient is not skipped");
    }

    appointment.isSkipped = false;
    await appointment.save();

    await redis.del(`dashboard:${appointment.doctorId}`);

    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Patient recalled")
        );
});