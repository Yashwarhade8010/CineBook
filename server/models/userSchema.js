const {Schema,model, mongo, default: mongoose} = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    Bookings:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BookTicket"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password,10)
    this.password = hashedPassword
    next();
})
userSchema.methods.matchPassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

const User = model('User',userSchema);
module.exports = User;