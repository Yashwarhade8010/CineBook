const {Schema,model} = require("mongoose")


const bookSchema = new Schema({
    user:{
        type:String,
        required:true,
    },
    movie:{
        type:Schema.Types.ObjectId,
        ref:"Movie"
    },
    screen:{
        type:Schema.Types.ObjectId,
        ref:"Screen"
    },
    show:{
        type:Schema.Types.ObjectId,
        ref:"Show"
    },
    seats:[{
        row: {type:String},
        number: {type:Number},
   
    }],
    status:{
        type:String,
        enum:["Pending","Confirmed","Failed","Cancelled"],
        default:"Pending"
    },
    paymentId:{
        type:String
    },
    bookedAt:{
        type:Date,
        default:Date.now
    }
})

const BookTicket = model("BookTicket",bookSchema)

module.exports = BookTicket