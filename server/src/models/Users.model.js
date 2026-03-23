import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String
        },
        publicId: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ['admin', 'receptionist', 'doctor', 'patient'],
        default: 'patient',
        required: true
    }
}, { timestamps: true })

const Users = mongoose.model('Users', userSchema)
export default Users