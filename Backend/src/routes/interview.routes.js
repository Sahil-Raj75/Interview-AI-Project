const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const interviewRouter = express.Router();
const interviewController = require('../controller/interview.controller')
const upload = require('../middleware/file.middleware')

/**
 * @route Post /api/interview/generate
 * @description generate a interview report for the user
 * @access Private
 */
interviewRouter.post('/generate', authMiddleware.authUser, upload.single("resume"), interviewController.generateReport)

/**
 * @route Get /api/interview/report/:id
 * @description get a interview report by id 
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getReportById)

/**
 * @route Get /api/interview/reports
 * @description get all the interview reports 
 * @access Private
 */
interviewRouter.get('/reports', authMiddleware.authUser, interviewController.getAllReports)

/**
 * @route Post /api/interview/resume/pdf
 * @description get the resume of the user
 * @access Private
 */
interviewRouter.post('/resume/pdf/:interviewId', authMiddleware.authUser, interviewController.generateResumePdfController)

/**
 * @route Post /api/interview/report/:interviewId/follow-up
 * @description handle follow up questions for the user
 * @access Private
 */

interviewRouter.post('/report/:interviewId/follow-up', authMiddleware.authUser, interviewController.handleFollowUp);
module.exports = interviewRouter;