import express from 'express'
import * as receptionistController from '../controller/receptionist.controller.js'
import protect from '../middlewares/protect.js'
import checkReceptionist from '../middlewares/checkReceptionist.js'

const receptionistRouter = express.Router()

receptionistRouter.post('/checkIn', protect, checkReceptionist, receptionistController.checkInPatient)
receptionistRouter.post('/recall', protect, checkReceptionist, receptionistController.recallPatient)

export default receptionistRouter