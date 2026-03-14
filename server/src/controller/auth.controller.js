import ApiErrors from "../helpers/ApiErrors.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import { check, validationResult } from 'express-validator'
import Users from "../models/Users.model.js";
import redis from "../db/redis.js";
import bcrypt from 'bcryptjs'
import ApiResponse from "../helpers/ApiResponse.js";
import { generateVerificationMail, sendBrevoMail } from "../config/mail.js";

export const registrationPatient = [
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
        .withMessage('phoneNumber is unvalid'),
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
        const { fullName, email, role, phoneNumber, password } = req.body

        if (role !== 'patient') {
            throw new ApiErrors(400, 'invalid role')
        }

        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'unvalid value', error.array())
        }

        const limitKey = `authLimit:${email}`
        const count = await redis.incr(limitKey)

        if (count === 1) {
            await redis.expire(limitKey, 1800)
        }

        if (count > 5) {
            throw new ApiErrors(429, 'too many request')
        }

        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            throw new ApiErrors(400, 'user already registered')
        }

        const hashPassword = await bcrypt.hash(password, 12)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        try {
            const { subject, html } = generateVerificationMail(otp)
            await sendBrevoMail(email, subject, html)
        } catch (error) {
            throw new ApiErrors(500, 'email send failed')
        }

        const redisKey = `userRegistration:${email}`
        await redis.set(redisKey, JSON.stringify({
            fullName: fullName,
            email: email,
            role: role,
            phoneNumber: phoneNumber,
            password: hashPassword,
            otp: otp,
            verify: false
        }), "EX", 300)

        return res
            .status(202)
            .json(
                new ApiResponse(202, 'user registration successfully')
            )
    })
]

export const verifyRegi = AsyncHandler(async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        throw new ApiErrors(400, 'all value are required')
    }

    const limitKey = `authLimit:${email}`
    const count = await redis.incr(limitKey)

    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 5) {
        throw new ApiErrors(429, 'too many request')
    }

    const redisKey = `userRegistration:${email}`

    const redisUserString = await redis.get(redisKey)

    if (!redisUserString) {
        throw new ApiErrors(400, 'otp is expired')
    }

    const redisUser = JSON.parse(redisUserString)

    if (redisUser.otp !== otp) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    const user = await Users.create({
        fullName: redisUser.fullName,
        password: redisUser.password,
        role: redisUser.role,
        email: redisUser.email,
        phoneNumber: redisUser.phoneNumber
    })

    if (!user) {
        throw new ApiErrors(500, 'user created failed')
    }

    user.password = undefined

    await redis.del(redisKey)

    return res
        .status(201)
        .json(
            new ApiResponse(201, user, 'user verify successfully')
        )
})