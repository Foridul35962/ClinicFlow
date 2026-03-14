import express from 'express'
import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/db/connectDB.js'
dotenv.config()

const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`)
    })
}).catch(() => {
    console.log('server started failed')
})