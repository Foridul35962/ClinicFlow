import redis from "../db/redis.js";
import ApiResponse from "../helpers/ApiResponse.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import Departments from "../models/Departments.model.js";

export const fetchAllDepartment = AsyncHandler(async(req, res)=>{
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