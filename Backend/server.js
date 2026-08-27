require('dotenv').config()
const connectToDB = require('./src/config/database.js')
const app = require('./src/app.js')

async function startServer() {
    await connectToDB()

    const port = process.env.PORT || 3000
    app.listen(port, () => {
        console.log(`Server is running on port:${port}`)
    })
}

startServer().catch(() => {
    process.exitCode = 1
})