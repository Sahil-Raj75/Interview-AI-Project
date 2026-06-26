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
interviewRouter.post('/generate', authMiddleware.authUser , upload.single("resume") , interviewController.generateReport)

module.exports = interviewRouter;