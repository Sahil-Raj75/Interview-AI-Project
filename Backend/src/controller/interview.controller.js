const generateInterviewReport = require('../services/ai.services')
const pdfParse = require('pdf-parse')
const interviewReportModel = require('../model/interviewReport.model')
const userModel = require('../model/user.model')

/**
 * @description Generate an interview report based on user data
 */
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

/**
 * @description Get all the interview reports for a user
 */

const getAllReports = async (req, res) => {
    const userId = req.user.id;

    try {
        const reports = await interviewReportModel.find({user: userId}).sort({createdAt: -1}).select('-resume - jobDescription -selfDescription -__v -skillGaps -preparationPlan -tecnicalQuestions -behavioralQuestions');
        
        return res.status(200).json({
            message: "Reports fetched successfully",
            reports
        })
    }
    catch(error) {
        return res.status(500).json({ error: error.message });
    }
}

/** 
 * @description Get a specific interview report by ID of a user
*/
const getReportById = async (req, res) => {
    const { interviewId } = req.params;

    try {
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        return res.status(200).json({
            message: "InterviewReport Fetched successfully",
            interviewReport
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { generateReport, getAllReports, getReportById }