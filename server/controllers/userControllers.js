const User = require("../models/userSchema");

const handleRegister = async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"All fields required"})
    }
    try{
        const user = await User.findOne({$or:[{username},{email}]});
        
        if(user){
            return res.status(400).json({message:"Username or email is already taken"});
        }

        User.create({
            username,
            email,
            password
        })
        return res.status(201).json({message:"Register successfull"})
    }catch(err){
        console.log(err);
    }
}

const handleLogin = async(req,res)=>{
    const {usernameOrEmail,password} = req.body;
    if(!usernameOrEmail || !password){
        return res.status(400).json({message:"All fields required"})
    }

    try{
        const user = await User.findOne({$or:[{username:usernameOrEmail},{email:usernameOrEmail}]});
        if(!user){
            return res.status(400).json({message:"User not exist"})
        }
        let verifyPass = await user.matchPassword(password);
        if(!verifyPass){
            return res.status(401).json({message:"Wrong Password"})
        }
        return res.status(200).json({message:"Login successful"})
    }catch(err){
        console.log(err);
    }

}


module.exports = {
    handleRegister,
    handleLogin
}