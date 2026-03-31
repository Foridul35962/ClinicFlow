import ApiErrors from "../helpers/ApiErrors.js";
import AsyncHandler from "../helpers/AsyncHandler.js";

const checkPatient = AsyncHandler(async(req, res, next)=>{
    const user = req.user
    if (user.role !== 'patient') {
        throw new ApiErrors(401, 'unathorized access')
    }

    next()
})

export default checkPatient