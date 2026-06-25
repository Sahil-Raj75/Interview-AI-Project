const {Router} = require('express')
const authController = require('../controller/auth.Controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const authRouter = Router()
/**
 * @route POST /api/auth/register
 * @description register a new user
 * @@access PUBLIC
 */
authRouter.post("/register",authController.registerUsercontroller)

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access PUBLIC
 */
authRouter.post("/login",authController.loginUsercontroller)

/**
 * @route GET /api/auth/logout
 * @description Logout the user form the server
 * @access PUBLIC
 */
authRouter.get("/logout",authController.logoutUsercontroller)

/**
 * @route GET /api/auth/get-me
 * @description get the user 
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser , authController.getMeController)

module.exports = authRouter