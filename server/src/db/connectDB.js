import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/clinicFlow`)
            .then(()=>{
                console.log('database is connected successfully')
            })
    } catch (error) {
        console.log('database connect failed', error.message)
    }
}

export default connectDB