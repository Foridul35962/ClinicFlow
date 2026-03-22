import express from 'express'
import * as adminController from '../controller/admin.controller.js'
import protect from '../middlewares/protect.js'
import checkAdmin from '../middlewares/checkAdmin.js'
import upload from '../middlewares/upload.js'

const adminRouter = express.Router()

adminRouter.post('/add-member', protect, checkAdmin, upload, adminController.addMember)
adminRouter.patch('/edit-member/:memberId', protect, checkAdmin, upload, adminController.editMember)
adminRouter.delete('/delete-member/:memberId', protect, checkAdmin, adminController.deleteMember)

export default adminRouter