const generateInterviewReport  = require('../services/ai.services')
const pdfParse = require('pdf-parse')
const interviewReportModel = require('../model/interviewReport.model')
const userModel = require('../model/user.model')

const generateReport = async (req, res) => {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const { selfDescription, jobDescription } = req.body

    try {
        const reportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
        });

        const reportPayload = {
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...reportByAi,
        };

        if (!reportPayload.behavioralQuestions && reportPayload.behaviouralQuestions) {
            reportPayload.behavioralQuestions = reportPayload.behaviouralQuestions;
        }

        const report = await interviewReportModel.create(reportPayload)

        return res.status(201).json({
            message: "Report Created successfully",
            data: report
        })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }


}

module.exports = { generateReport }