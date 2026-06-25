const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const interviewRouter = express.Router();

/**
 * @route Post
 * @description generate a interview report for the user
 * @access Private
 */
interviewRouter.post('/', authMiddleware.authUser)

module.exports = interviewRouter;