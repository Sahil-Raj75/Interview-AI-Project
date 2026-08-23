const { generateInterviewReport, generateResumePdf } = require('../services/ai.services')
const pdfParse = require('pdf-parse')
const interviewReportModel = require('../model/interviewReport.model')
const { generateFollowUpResponse } = require('../services/ai.services');


/**
 * @description Generate an interview report based on user data
 */
const generateReport = async (req, res) => {
    // just using pdfParse(req.file.buffer)
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
        const reports = await interviewReportModel.find({ user: userId }).sort({ createdAt: -1 }).select('-resume -jobDescription -selfDescription -__v -skillGaps -preparationPlan -technicalQuestions -behavioralQuestions');

        return res.status(200).json({
            message: "Reports fetched successfully",
            reports
        })
    }
    catch (error) {
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

/**
 * @description Controller that generate the Pdf based on the resume ,selfDescription, jobDescription.
 */
const generateResumePdfController = async (req, res) => {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findById({ _id: interviewId })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description FollowUp conversesion Controller for interview mock
 */
const handleFollowUp = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { questionId, answer, questionType } = req.body; // questionType: 'technical' or 'behavioral'
        const userId = req.user.id;

        if (!questionId || !answer || !questionType) {
            return res.status(400).json({ message: "Question ID, answer, and question type are required." });
        }

        // Find the report and ensure it belongs to the logged-in user
        const report = await interviewReportModel.findOne({ _id: interviewId, user: userId });
        if (!report) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        // Select the correct questions array based on type
        const questionsList = questionType === 'technical' ? report.technicalQuestions : report.behavioralQuestions;
        const questionObj = questionsList.id(questionId);

        if (!questionObj) {
            return res.status(404).json({ message: "Question not found in report." });
        }

        // Push user message to conversation history
        questionObj.conversation.push({
            sender: 'user',
            text: answer
        });

        // Call Gemini AI service for the follow-up response
        const aiResponseText = await generateFollowUpResponse({
            resume: report.resume || "Candidate resume context", // Fallback if property name differs
            jobDescription: report.jobDescription,
            question: questionObj.question,
            intention: questionObj.intention,
            suggestedAnswer: questionObj.answer,
            conversationHistory: questionObj.conversation,
            userAnswer: answer
        });

        // Push AI response to conversation history
        questionObj.conversation.push({
            sender: 'ai',
            text: aiResponseText
        });

        await report.save();

        return res.status(200).json({
            message: "Follow-up generated successfully",
            conversation: questionObj.conversation
        });

    } catch (error) {
        console.error("Error in handleFollowUp:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { generateReport, getAllReports, getReportById, generateResumePdfController, handleFollowUp }