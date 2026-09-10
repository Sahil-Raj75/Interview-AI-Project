const express = require("express")
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const normalizeOrigins = (value = '') => value
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

const allowedOrigins = new Set([
    ...normalizeOrigins(process.env.FRONTEND_URL),
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://localhost:3000'
])

app.set('trust proxy', 1)
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin) || /^https:\/\/.*\.vercel\.app$/i.test(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Origin is not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// use all the api starts with 
app.use('/api/auth',authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app