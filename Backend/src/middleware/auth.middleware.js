const jwt = require('jsonwebtoken')
const blacklistTokenModel = require('../model/blacklist.model')

async function authUser(req, res, next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message : "token not provided"
        })
    }
    
    const isTokenblackListed = await blacklistTokenModel.findOne({token})

    if(isTokenblackListed){
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = {authUser}