const { default: mongoose } = require("mongoose");
const Movie = require("../models/movieSchema");
const Screen = require("../models/screenSchema");
const Show = require("../models/showSchema");
const asyncHandler = require("express-async-handler");
const validateRequestBody = require("../utils/validateHelper");

const handleAddMovie = asyncHandler(async(req,res)=>{
    const { movieName, language, genre, duration, posterUrl, description } =
      req.body;
    const validate = validateRequestBody(req.body,["movieName","language","genre","duration","posterUrl","description"])

    if(validate){
        return res.status(400).json({message:validate})
    }
    const movie = await Movie.create({
        name:movieName,
        language,
        genre,
        duration,
        posterUrl,
        description
    })
    return res.status(201).json({status:true,data:movie,message:"movie added successfully"})
    
});

const handleAddScreen = async(req,res)=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({message:"Name required"})
    }
    try{
        const screen = await Screen.create({
            name
        })
        return res.status(201).json({status:true,data:screen,message:"screen added successfully"})
    }catch(err){
        console.log(err);
    }
}

const handleAddShow = asyncHandler(async(req,res)=>{
    const {movieId,screenId,showTime} = req.body;

    const validate = validateRequestBody(req.body,["movieId","screenId","showTime"])

    if(validate){
        return res.status(400).json({message:validate})
    }
    const session = await mongoose.startSession();

    session.startTransaction();
    const movie = await Movie.findById(movieId).session(session);

    if(!movie){
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({message:"Movie not found"})
    }

    const movieDuration = movie.duration;

    const newShowStartTime = new Date(showTime);
    const newShowEndTime = new Date(newShowStartTime.getTime() + movieDuration*60000);

    const existingShows = await Show.find({screen:screenId}).session(session).populate("movie").session(session)

    const isClashing = existingShows.some((show)=>{
        const existingShowStartTime = new Date(show.showTime);
        const existingShowEndTime = new Date(existingShowStartTime.getTime() + show.movie.duration*60000);

        return(
            (newShowStartTime >= existingShowStartTime && newShowStartTime < existingShowEndTime) ||
            (newShowEndTime > existingShowStartTime && newShowEndTime <= existingShowEndTime) ||
            (newShowStartTime <= existingShowStartTime && newShowEndTime >= existingShowEndTime)
        )
    })

    if(isClashing){
        return res.status(400).json({message:"Show time clashes with existing show time"})
    }
    let show = new Show({
        movie:movieId,
        screen:screenId,
        showTime:newShowStartTime
    })
    await show.save({session});

    await session.commitTransaction();
    session.endSession()

    show = await show.populate(["movie","screen"])
    return res.status(201).json({status:true,data:show,message:"Show added successfully"})
})

module.exports = {
    handleAddMovie,
    handleAddScreen,
    handleAddShow
}