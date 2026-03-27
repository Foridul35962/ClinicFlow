import redis from "../db/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Departments from "../models/Departments.model.js";
import Doctors from "../models/Doctors.model.js";

export const fetchAllDepartment = AsyncHandler(async (req, res) => {
    const redisKey = 'allDepartments'
    const redisDepartment = await redis.get(redisKey)

    let department
    if (redisDepartment) {
        department = JSON.parse(redisDepartment)
    } else {
        department = await Departments.find().lean()
        await redis.set(redisKey,
            JSON.stringify(department),
            "EX",
            600
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, department, 'depertments fetch successfully')
        )
})

export const getDoctor = AsyncHandler(async (req, res) => {
    const { doctorId } = req.params
    if (!doctorId) {
        throw new ApiErrors(400, 'doctor id is required')
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

    return res
        .status(200)
        .json(
            new ApiResponse(200, doctor, 'doctor fetch successfully')
        )
})