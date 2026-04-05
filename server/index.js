import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/db/connectDB.js'
import { startServer } from './src/db/redis.js'
dotenv.config()
import http from 'http'
import { Server } from 'socket.io'
import { socketHandler } from './src/config/socket.js'

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

app.set('io', io)

socketHandler(io)

startServer().then(() => {
    connectDB().then(() => {
        server.listen(PORT, () => {
            console.log(`server is running at http://localhost:${PORT}`)
        })
    }).catch(() => {
        console.log('server started failed')
    })
}).catch(() => {
    console.log('redis started failed')
})