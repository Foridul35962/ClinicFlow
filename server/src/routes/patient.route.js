import express from 'express';
import * as patientController from '../controller/patient.controller.js'
import protect from '../middlewares/protect.js';
import checkPatient from '../middlewares/checkPatient.js';

const patientRouter = express.Router()

patientRouter.post('/appointment', protect, checkPatient, patientController.addAppointment)
patientRouter.get('/appointmentHistory', protect, checkPatient, patientController.appointmentHistory)
patientRouter.get('/get-appointment/:appointmentId', protect, checkPatient, patientController.getAppointment)

export default patientRouter