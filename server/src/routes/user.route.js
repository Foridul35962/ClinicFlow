import express from 'express'
import * as userController from '../controller/user.controller.js'

const userRouter = express.Router()

userRouter.get('/allDepartment', userController.fetchAllDepartment)

export default userRouter