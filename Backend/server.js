require('dotenv').config()
const connectToDB = require('./src/config/database.js')
const app = require('./src/app.js')
const generateInterviewReport = require('./src/services/ai.services.js')
const {resume , selfDescription , jobDescription} = require('./src/services/temp.js')

connectToDB()
generateInterviewReport({resume , selfDescription , jobDescription});

app.listen(3000 , ()=>{
    console.log("Server is running on port:3000");
    
})