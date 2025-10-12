const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    hashedToken:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    used:{
        type:Boolean,
        default:false
    }
})

tokenSchema.index({expiresAt:1},{expireAfterSeconds:0});

const ResetToken = mongoose.model("ResetToken",tokenSchema)
module.exports = ResetToken