import ApiErrors from "../helpers/ApiErrors";
import AsyncHandler from "../helpers/AsyncHandler.js";

const checkAdmin = AsyncHandler(async(req, res, next)=>{
    const user = req.user
    if (user.role !== 'admin') {
        throw new ApiErrors(401, 'unathorized access')
    }

    next()
})

export default checkAdmin