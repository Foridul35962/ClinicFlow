import express from 'express'
import * as userController from '../controller/user.controller.js'

const userRouter = express.Router()

userRouter.get('/allDepartment', userController.fetchAllDepartment)
userRouter.get('/doctor/:doctorId', userController.getDoctor)
userRouter.get('/departmentDoctor/:departmentId', userController.departmentDoctors)

export default userRouter