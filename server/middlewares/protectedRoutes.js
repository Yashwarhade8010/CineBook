const { verifyToken } = require("./auth")

const checkAuth = async(req,res,next)=>{
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"No token Provided, authorization denied"})
    }
    try{
        const user = verifyToken(token);
        req.user = user;
        next()
    }catch (err){
        return res.status(403).json({message:"Invalid token"})
    }
}
const checkAuthForAdmin = async(req,res,next)=>{
    token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"No token Provided, authorization denied"})
    }
    try{
        const user = verifyToken(token)
       
        if(user.role != "ADMIN"){
            return res.status(401).json({message:"Access denied"});
        }
        req.user = user;
        next()
    }catch(err){
        return res.status(403).json({message:"Invalid token"})
    }
}
module.exports = {checkAuth,checkAuthForAdmin}