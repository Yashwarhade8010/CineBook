const {model,Schema} = require("mongoose")

const showSchema = new Schema({
    movie:{
        type:Schema.Types.ObjectId,
        ref:"Movie",
        required:true
    },
    screen:{
        type:Schema.Types.ObjectId,
        ref:"Screen",
        required:true
    },
    showTime:{
        type:Date,
        require:true
    }
})

const Show = model("Show",showSchema)
module.exports = Show