const {model,Schema} = require("mongoose")

const movieSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true   
    },
    posterUrl:{
        type:String,
        required:true
    },
    description:{
        type:String,
    }
})
const Movie = model("Movie",movieSchema);
module.exports = Movie;