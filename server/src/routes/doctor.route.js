import express from "express"
import * as doctorController from '../controller/doctor.controller.js'
import protect from "../middlewares/protect.js"

const doctorRouter = express.Router()

doctorRouter.get('/dashboard', protect, doctorController.doctorDashboard)
doctorRouter.get('/call-next-patient', protect, doctorController.callNextPatient)
doctorRouter.patch('/completeAppointment', protect, doctorController.completeAppointment)

export default doctorRouter