const express = require("express")
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
            .split(',')
            .map(value => value.trim())
            .filter(Boolean)

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Origin is not allowed by CORS'))
    },
    credentials : true
}))

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// use all the api starts with 
app.use('/api/auth',authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app