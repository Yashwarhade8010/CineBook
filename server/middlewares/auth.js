const {sign, verify} = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const generateToken = (user)=>{
    try {
        const token = sign(user,process.env.SECRET,{expiresIn:"1h"})
        return token;
    }catch(err){
        console.error(err.message)
        throw new Error("Failed to generate token")
    }
}

const verifyToken = (token)=>{
    try{
        const decoded = verify(token,process.env.SECRET);
        return decoded;
    }catch(err){
        console.error(err.message);
        throw new Error("Failed to verify token")
    }
}


module.exports = {
    generateToken,
    verifyToken
}