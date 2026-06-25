const userModel = require("../model/user.model.js")
const blacklistModel = require('../model/blacklist.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * @name registerUsercontroller
 * @description register a new user
 * @access Public
 */

const registerUsercontroller = async ( req ,res ) => {

    const {username, email , password} = req.body

    if(!username , !email , !password){
        return res.status(400).json({
            message:"Provide username , email , passoword"
        })
    }

    const isAlreadyExists = await userModel.findOne({
        $or : [{username},{email}]
    })

    if(isAlreadyExists){
        return res.status(400).json({
            message:"User Already Exist"
        })
    }

    const hash = await bcrypt.hash(password , 10);

    const user = await userModel.create({
        username,
        email,
        password : hash
    })



    const token = await jwt.sign(
        {id: user._id , username:user.username} , 
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie('token', token)

     res.status(200).json({
        message: "User register successfull",
        user:{
            id : user._id,
            username: user.username,
            email: user.email,
        }
    })
}

/**
 * @name loginUsercontroller
 * @description login user 
 * @access Public
 */

const loginUsercontroller = async (req,res) => {
    const {email , password} = req.body
    
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const isPassCorrect = await bcrypt.compare(password,user.password)

    if(!isPassCorrect){
        return res.status(400).json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign(
        {id:user._id , username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    return res.status(200).json({
        message:"User login successfully",
        user:{
            id : user._id,
            username : user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutuser
 * @description logout the user and blacklist the token
 * @access PUBLIC
 */
const logoutUsercontroller = async (req, res) => {
    const token = req.cookies.token

    if(token){
        await blacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message : "user logged out successfully"
    })
}

/**
 * @name getmeuser
 * @description get the current user logged in user detail
 * @access private
 */
const getMeController = async (req ,res)=>{
    const user = await userModel.findOne(req.user._id)

    res.status(200).json({
        message:"user fetch succesfully",
        user:{
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}


module.exports = {
    registerUsercontroller,
    loginUsercontroller,
    logoutUsercontroller,
    getMeController
}