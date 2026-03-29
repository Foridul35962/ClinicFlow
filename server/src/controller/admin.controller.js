import ApiErrors from "../helpers/ApiErrors.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import { check, validationResult } from 'express-validator'
import Users from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../helpers/ApiResponse.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";
import Departments from "../models/Departments.model.js";
import mongoose from "mongoose";
import redis from "../db/redis.js";
import Doctors from "../models/Doctors.model.js";

export const addReceptionist = [
    check('fullName')
        .trim()
        .notEmpty()
        .withMessage('FullName is required'),
    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid Email'),
    check('phoneNumber')
        .trim()
        .notEmpty()
        .withMessage('phoneNumber is required')
        .isMobilePhone('bn-BD')
        .withMessage('phoneNumber is invalid'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    AsyncHandler(async (req, res) => {
        const { fullName, email, password, phoneNumber } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid value', error.array())
        }

        const image = req.files?.[0]
        if (!image) {
            throw new ApiErrors(400, 'image not found')
        }

        if (!image.mimetype.startsWith('image/')) {
            throw new ApiErrors(400, 'only image files are allowed')
        }

        const existingUser = await Users.findOne({ email })

        if (existingUser) {
            throw new ApiErrors(400, 'user is already registered')
        }

        const hashedPass = await bcrypt.hash(password, 12)

        let upload
        try {
            const uploaded = await uploadToCloudinary(image.buffer, 'ClinicFlow')
            upload = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id
            }
        } catch (error) {
            throw new ApiErrors(500, 'image upload failed')
        }

        const user = await Users.create({
            email,
            password: hashedPass,
            role: 'receptionist',
            phoneNumber,
            fullName,
            image: upload
        })

        if (!user) {
            throw new ApiErrors(500, 'user registered failed')
        }

        user.password = undefined
        user.image.publicId = undefined
        const redisKey = 'receptionist:all'
        await redis.del(redisKey)

        return res
            .status(201)
            .json(
                new ApiResponse(201, user, 'receptionist registered successfully')
            )
    })
]

export const deleteReceptionist = AsyncHandler(async (req, res) => {
    const { receptionistId } = req.params

    if (!receptionistId) {
        throw new ApiErrors(400, 'receptionist id is required')
    }

    const receptionist = await Users.findById(receptionistId)
    if (!receptionist) {
        throw new ApiErrors(404, 'receptionist is not found')
    }

    try {
        await cloudinary.uploader.destroy(receptionist.image.publicId)
    } catch (error) {
        throw new ApiErrors(500, 'image deleted failed')
    }

    await receptionist.deleteOne()
    const redisKey = 'receptionist:all'
    await redis.del(redisKey)

    return res
        .status(200)
        .json(
            new ApiResponse(200, receptionistId, 'receptionist deleted successfully')
        )
})

export const editReceptionist = [
    check('fullName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Full name cannot be empty'),

    check('phoneNumber')
        .optional()
        .isMobilePhone('bn-BD')
        .withMessage('invalid phone number'),

    AsyncHandler(async (req, res) => {
        const { fullName, phoneNumber } = req.body;
        const { receptionistId } = req.params;

        if (!receptionistId) {
            throw new ApiErrors(400, "receptionist id is required");
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiErrors(400, "invalid value", errors.array());
        }

        if (!fullName && !phoneNumber && !req.files?.[0]) {
            throw new ApiErrors(400, "at least one field is required");
        }

        const receptionist = await Users.findById(receptionistId);
        if (!receptionist) {
            throw new ApiErrors(404, "receptionist is not found");
        }

        if (fullName) {
            receptionist.fullName = fullName
        }

        if (phoneNumber) {
            receptionist.phoneNumber = phoneNumber;
        }

        // Handle image
        const image = req.files?.[0];

        if (image && !image.mimetype.startsWith('image/')) {
            throw new ApiErrors(400, 'only image files are allowed');
        }

        if (image) {
            try {
                const uploaded = await uploadToCloudinary(image.buffer, "ClinicFlow");

                if (receptionist.image?.publicId) {
                    await cloudinary.uploader.destroy(receptionist.image.publicId);
                }

                receptionist.image = {
                    url: uploaded.secure_url,
                    publicId: uploaded.public_id,
                };
            } catch (error) {
                throw new ApiErrors(500, "image upload failed");
            }
        }

        await receptionist.save();

        receptionist.password = undefined;
        if (receptionist.image) {
            receptionist.image.publicId = undefined;
        }

        const redisKey = 'receptionist:all'
        await redis.del(redisKey)

        return res.status(200).json(
            new ApiResponse(200, receptionist, "receptionist updated successfully")
        );
    })
]

export const getAllReceptionist = AsyncHandler(async (req, res) => {
    const redisKey = 'receptionist:all'

    const redisAllReceptionist = await redis.get(redisKey)
    let allReceptionist

    if (redisAllReceptionist) {
        allReceptionist = JSON.parse(redisAllReceptionist)
    } else {
        allReceptionist = await Users.find({ role: "receptionist" })
            .select('-password -image.publicId')
            .lean()

        await redis.set(redisKey,
            JSON.stringify(allReceptionist),
            "EX", 600
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, allReceptionist, 'all receptionist get successful')
        )
})

export const addDepartment = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Department name is required'),
    check('description')
        .optional()
        .trim(),

    AsyncHandler(async (req, res) => {
        const { name, description } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid data', error.array())
        }

        const existingDepartment = await Departments.findOne({
            name: { $regex: `^${name}$`, $options: 'i' }
        })

        if (existingDepartment) {
            throw new ApiErrors(400, 'department is already added')
        }

        const department = await Departments.create({
            name,
            description
        })

        if (!department) {
            throw new ApiErrors(500, 'department created failed')
        }

        const redisKey = 'allDepartments'
        await redis.del(redisKey)

        await fetch(
            `${process.env.NEXT_APP_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
            { method: 'POST' }
        )

        return res
            .status(201)
            .json(
                new ApiResponse(201, department, 'department created successfully')
            )
    })
]

export const editDepartment = AsyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { departmentId } = req.params
    if (!departmentId || !mongoose.isValidObjectId(departmentId)) {
        throw new ApiErrors(400, 'departmentId is required')
    }

    const department = await Departments.findById(departmentId)
    if (!department) {
        throw new ApiErrors(404, 'department is found')
    }

    if (name) {
        department.name = name
    }
    if (description) {
        department.description = description
    }

    const updatedDepartment = await department.save()
    if (!updatedDepartment) {
        throw new ApiErrors(500, 'department updated failed')
    }

    const redisKey = 'allDepartments'
    await redis.del(redisKey)

    await fetch(
        `${process.env.NEXT_APP_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
        { method: 'POST' }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedDepartment, 'department updated successfully')
        )
})

export const deleteDepartment = AsyncHandler(async (req, res) => {
    const { departmentId } = req.params
    if (!departmentId || !mongoose.isValidObjectId(departmentId)) {
        throw new ApiErrors(400, 'departmentId is required')
    }

    try {
        await Departments.findByIdAndDelete(departmentId)
    } catch (error) {
        throw new ApiErrors(404, 'department is not found')
    }

    const redisKey = 'allDepartments'
    await redis.del(redisKey)

    await fetch(
        `${process.env.NEXT_APP_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
        { method: 'POST' }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, departmentId, 'department delete successfully')
        )
})

export const getDoctors = AsyncHandler(async (req, res) => {
    let doctors

    const doctorKey = 'doctors:all'
    const redisDoctor = await redis.get(doctorKey)

    if (redisDoctor) {
        doctors = JSON.parse(redisDoctor)
    } else {
        doctors = await Doctors.find()
            .populate({
                path: 'userId',
                select: '-password -image.publicId'
            })
            .populate({
                path: 'departmentId',
                select: '-chamberNumber -consultationFee -slotDuration'
            })
            .lean()

        await redis.set(
            doctorKey,
            JSON.stringify(doctors),
            "EX",
            600
        )
    }

    return res.status(200).json(
        new ApiResponse(200, doctors, 'doctors fetch successful')
    )
})

export const addDoctor = [
    (req, res, next) => {
        if (req.body.schedule && typeof req.body.schedule === "string") {
            try {
                req.body.schedule = JSON.parse(req.body.schedule)
            } catch (err) {
                throw new ApiErrors(400, 'Invalid schedule JSON format')
            }
        }
        next()
    },

    // User fields
    check('fullName')
        .trim()
        .notEmpty()
        .withMessage('FullName is required'),

    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid Email'),

    check('phoneNumber')
        .trim()
        .notEmpty()
        .withMessage('phoneNumber is required')
        .isMobilePhone('bn-BD')
        .withMessage('phoneNumber is invalid'),

    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    // Doctor fields
    check('departmentId')
        .notEmpty()
        .withMessage('departmentId is required')
        .isMongoId()
        .withMessage('Invalid departmentId'),

    check('chamberNumber')
        .trim()
        .notEmpty()
        .withMessage('chamberNumber is required'),

    check('consultationFee')
        .notEmpty()
        .withMessage('consultationFee is required')
        .isFloat({ min: 0 })
        .withMessage('consultationFee must be a positive number'),

    check('slotDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('slotDuration must be at least 1 minute'),

    // Schedule
    check('schedule')
        .isArray({ min: 1 })
        .withMessage('schedule must be a non-empty array'),

    check('schedule.*.dayOfWeek')
        .notEmpty()
        .withMessage('dayOfWeek is required')
        .isIn(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
        .withMessage('Invalid dayOfWeek'),

    check('schedule.*.startTime')
        .notEmpty()
        .withMessage('startTime is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('startTime must be HH:MM format'),

    check('schedule.*.endTime')
        .notEmpty()
        .withMessage('endTime is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('endTime must be HH:MM format'),

    check('schedule').custom((schedule) => {
        for (let slot of schedule) {
            const [sh, sm] = slot.startTime.split(':').map(Number);
            const [eh, em] = slot.endTime.split(':').map(Number);

            const start = sh * 60 + sm;
            const end = eh * 60 + em;

            if (start >= end) {
                throw new Error('startTime must be less than endTime');
            }
        }
        return true;
    }),

    // Controller
    AsyncHandler(async (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid data', error.array())
        }

        const {
            fullName,
            email,
            password,
            phoneNumber,
            departmentId,
            chamberNumber,
            consultationFee,
            slotDuration,
            schedule
        } = req.body

        const image = req.files?.[0]
        if (!image) {
            throw new ApiErrors(400, 'image not found')
        }

        if (!image.mimetype.startsWith('image/')) {
            throw new ApiErrors(400, 'only image files are allowed')
        }

        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            throw new ApiErrors(400, 'Doctor is already registered')
        }

        const existingDepartment = await Departments.findById(departmentId)
        if (!existingDepartment) {
            throw new ApiErrors(404, 'department not found')
        }

        const hashedPass = await bcrypt.hash(password, 12)

        const session = await mongoose.startSession()
        session.startTransaction()

        let upload

        try {
            const uploaded = await uploadToCloudinary(image.buffer, 'ClinicFlow')
            upload = {
                url: uploaded.secure_url,
                publicId: uploaded.public_id
            }

            const user = await Users.create([{
                email,
                password: hashedPass,
                fullName,
                image: upload,
                phoneNumber,
                role: "doctor"
            }], { session })

            const doctor = await Doctors.create([{
                userId: user[0]._id,
                chamberNumber,
                consultationFee,
                departmentId,
                schedule,
                slotDuration
            }], { session })

            await session.commitTransaction()
            session.endSession()

            const populatedDoctor = await Doctors.findById(doctor[0]._id)
                .populate('userId departmentId')
                .select('-userId.password -userId.image.publicId')

            const doctorKey = 'doctors:all'
            await redis.del(doctorKey)

            return res.status(201).json(
                new ApiResponse(201, populatedDoctor, 'doctor added successfully')
            )

        } catch (err) {
            await session.abortTransaction()
            session.endSession()
            throw new ApiErrors(500, 'Doctor creation failed')
        }
    })
]

export const editDoctor = [
    // User fields
    check('fullName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('FullName cannot be empty'),

    check('phoneNumber')
        .optional()
        .trim()
        .isMobilePhone('bn-BD')
        .withMessage('phoneNumber is invalid'),

    // Doctor fields
    check('departmentId')
        .optional()
        .isMongoId()
        .withMessage('Invalid departmentId'),

    check('chamberNumber')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('chamberNumber cannot be empty'),

    check('consultationFee')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('consultationFee must be a positive number'),

    check('slotDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('slotDuration must be at least 1 minute'),

    // Schedule
    check('schedule')
        .optional()
        .custom((value) => {
            if (!value) return true;

            // If form-data, parse string to array
            let scheduleArray;
            if (typeof value === "string") {
                try {
                    scheduleArray = JSON.parse(value);
                } catch {
                    throw new Error('schedule must be a valid JSON array');
                }
            } else {
                scheduleArray = value;
            }

            if (!Array.isArray(scheduleArray) || scheduleArray.length === 0) {
                throw new Error('schedule must be a non-empty array');
            }

            // Validate each slot
            for (let slot of scheduleArray) {
                if (!slot.dayOfWeek || !["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].includes(slot.dayOfWeek)) {
                    throw new Error('Invalid dayOfWeek in schedule');
                }
                if (!slot.startTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot.startTime)) {
                    throw new Error('startTime must be HH:MM format');
                }
                if (!slot.endTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(slot.endTime)) {
                    throw new Error('endTime must be HH:MM format');
                }

                const [sh, sm] = slot.startTime.split(':').map(Number);
                const [eh, em] = slot.endTime.split(':').map(Number);
                const start = sh * 60 + sm;
                const end = eh * 60 + em;

                if (start >= end) {
                    throw new Error('startTime must be less than endTime');
                }
            }

            return true;
        }),

    // Controller
    AsyncHandler(async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid data', error.array());
        }

        const { doctorId } = req.params;
        if (!doctorId) {
            throw new ApiErrors(400, 'doctorId is required');
        }

        let {
            fullName,
            phoneNumber,
            departmentId,
            chamberNumber,
            consultationFee,
            slotDuration,
            schedule
        } = req.body;

        const image = req.files?.[0];

        // Parse schedule if it's string (form-data)
        if (schedule && typeof schedule === "string") {
            try {
                schedule = JSON.parse(schedule);
            } catch {
                throw new ApiErrors(400, 'schedule must be a valid JSON array');
            }
        }

        if (departmentId) {
            const existingDepartment = await Departments.findById(departmentId);
            if (!existingDepartment) {
                throw new ApiErrors(404, 'department not found');
            }
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find doctor
            const doctor = await Doctors.findById(doctorId).session(session);
            if (!doctor) {
                throw new ApiErrors(404, 'Doctor not found');
            }

            // Update user
            const userUpdates = {};
            if (fullName) userUpdates.fullName = fullName;
            if (phoneNumber) userUpdates.phoneNumber = phoneNumber;

            if (image) {
                if (!image.mimetype.startsWith('image/')) {
                    throw new ApiErrors(400, 'only image files are allowed');
                }
                const uploaded = await uploadToCloudinary(image.buffer, 'ClinicFlow');
                userUpdates.image = {
                    url: uploaded.secure_url,
                    publicId: uploaded.public_id
                };
            }

            if (Object.keys(userUpdates).length > 0) {
                await Users.findByIdAndUpdate(doctor.userId, userUpdates, { session });
            }

            // Update doctor fields
            const doctorUpdates = {};
            if (departmentId) doctorUpdates.departmentId = departmentId;
            if (chamberNumber) doctorUpdates.chamberNumber = chamberNumber;
            if (consultationFee !== undefined) doctorUpdates.consultationFee = consultationFee;
            if (slotDuration) doctorUpdates.slotDuration = slotDuration;
            if (schedule) doctorUpdates.schedule = schedule;

            if (Object.keys(doctorUpdates).length > 0) {
                await Doctors.findByIdAndUpdate(doctorId, doctorUpdates, { session });
            }

            await session.commitTransaction();
            session.endSession();

            const populatedDoctor = await Doctors.findById(doctorId)
                .populate('userId departmentId')
                .select('-userId.password -userId.image.publicId');

            const doctorKey = 'doctors:all'
            await redis.del(doctorKey)

            const redisKey = `Doctor:${doctorId}`
            await redis.del(redisKey)

            return res.status(200).json(
                new ApiResponse(200, populatedDoctor, 'doctor updated successfully')
            );
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw new ApiErrors(500, 'Doctor update failed');
        }
    })
];

export const deleteDoctor = AsyncHandler(async (req, res) => {
    const { doctorId } = req.params

    if (!doctorId) {
        throw new ApiErrors(400, 'doctor id is required')
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const doctor = await Doctors.findById(doctorId).session(session)
        if (!doctor) {
            throw new ApiErrors(404, 'Doctor not found')
        }

        const user = await Users.findById(doctor.userId).session(session)

        await Doctors.findByIdAndDelete(doctorId, { session })

        // Delete user
        await Users.findByIdAndDelete(doctor.userId, { session })

        await session.commitTransaction()
        session.endSession()

        if (user?.image?.publicId) {
            try {
                await cloudinary.uploader.destroy(user.image.publicId)
            } catch (err) {
                console.log('image delete failed:', err)
            }
        }

        const doctorKey = 'doctors:all'
        await redis.del(doctorKey)

        const redisKey = `Doctor:${doctorId}`
        await redis.del(redisKey)

        return res.status(200).json(
            new ApiResponse(200, doctorId, 'doctor deleted successfully')
        )

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiErrors(500, 'Doctor deletion failed')
    }
})