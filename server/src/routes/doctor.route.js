import express from "express"
import * as doctorController from '../controller/doctor.controller.js'
import protect from "../middlewares/protect.js"

const doctorRouter = express.Router()

doctorRouter.get('/dashboard', protect, doctorController.doctorDashboard)

export default doctorRouter