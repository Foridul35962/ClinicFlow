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

export const addMember = [
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
    check('role')
        .trim()
        .notEmpty()
        .withMessage('Role is required'),

    AsyncHandler(async (req, res) => {
        const { fullName, email, password, role, phoneNumber } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid value', error.array())
        }

        if (!['receptionist', 'doctor'].includes(role)) {
            throw new ApiErrors(400, 'invalid role')
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
            const uploaded = await uploadToCloudinary(image, 'ClinicFlow')
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
            role,
            phoneNumber,
            fullName,
            image: upload
        })

        if (!user) {
            throw new ApiErrors(500, 'user registered failed')
        }

        user.password = undefined
        user.image.publicId = undefined

        return res
            .status(201)
            .json(
                new ApiResponse(201, user, 'user registered successfully')
            )
    })
]

export const deleteMember = AsyncHandler(async (req, res) => {
    const { memberId } = req.params

    if (!memberId) {
        throw new ApiErrors(400, 'member id is required')
    }

    const member = await Users.findById(memberId)
    if (!member) {
        throw new ApiErrors(404, 'member is not found')
    }

    try {
        await cloudinary.uploader.destroy(member.image.publicId)
    } catch (error) {
        throw new ApiErrors(500, 'image deleted failed')
    }

    await member.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(200, memberId, 'member deleted successfully')
        )
})

export const editMember = [
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
        const { memberId } = req.params;

        if (!memberId) {
            throw new ApiErrors(400, "member id is required");
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiErrors(400, "invalid value", errors.array());
        }

        if (!fullName && !phoneNumber && !req.files?.[0]) {
            throw new ApiErrors(400, "at least one field is required");
        }

        const member = await Users.findById(memberId);
        if (!member) {
            throw new ApiErrors(404, "member is not found");
        }

        if (fullName) {
            member.fullName = fullName
        }

        if (phoneNumber) {
            member.phoneNumber = phoneNumber;
        }

        // Handle image
        const image = req.files?.[0];

        if (image && !image.mimetype.startsWith('image/')) {
            throw new ApiErrors(400, 'only image files are allowed');
        }

        if (image) {
            try {
                const uploaded = await uploadToCloudinary(image, "ClinicFlow");

                if (member.image?.publicId) {
                    await cloudinary.uploader.destroy(member.image.publicId);
                }

                member.image = {
                    url: uploaded.secure_url,
                    publicId: uploaded.public_id,
                };
            } catch (error) {
                throw new ApiErrors(500, "image upload failed");
            }
        }

        await member.save();

        member.password = undefined;
        if (member.image) {
            member.image.publicId = undefined;
        }

        return res.status(200).json(
            new ApiResponse(200, member, "member updated successfully")
        );
    })
]

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

    return res
        .status(200)
        .json(
            new ApiResponse(200, departmentId, 'department delete successfully')
        )
})