import express from 'express'
import * as adminController from '../controller/admin.controller.js'
import protect from '../middlewares/protect.js'
import checkAdmin from '../middlewares/checkAdmin.js'
import upload from '../middlewares/upload.js'

const adminRouter = express.Router()

adminRouter.post('/add-receptionist', protect, checkAdmin, upload, adminController.addReceptionist)
adminRouter.patch('/edit-receptionist/:receptionistId', protect, checkAdmin, upload, adminController.editReceptionist)
adminRouter.delete('/delete-receptionist/:receptionistId', protect, checkAdmin, adminController.deleteReceptionist)
adminRouter.get('/all-receptionist', protect, checkAdmin, adminController.getAllReceptionist)
adminRouter.post('/add-department', protect, checkAdmin, adminController.addDepartment)
adminRouter.patch('/edit-department/:departmentId', protect, checkAdmin, adminController.editDepartment)
adminRouter.delete('/delete-department/:departmentId', protect, checkAdmin, adminController.deleteDepartment)
adminRouter.get('/all-doctors', protect, checkAdmin, adminController.getDoctors)
adminRouter.post('/add-doctor', protect, checkAdmin, upload, adminController.addDoctor)
adminRouter.patch('/edit-doctor/:doctorId', protect, checkAdmin, upload, adminController.editDoctor)
adminRouter.delete('/delete-doctor/:doctorId', protect, checkAdmin, adminController.deleteDoctor)

export default adminRouter