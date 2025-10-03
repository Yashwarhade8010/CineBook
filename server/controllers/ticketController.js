const { default: mongoose } = require("mongoose");
const BookTicket = require("../models/bookingSchema");
const Screen = require("../models/screenSchema");
const User = require("../models/userSchema");

const buildSeatUpdate = require("../utils/seatHelpers");
const validateRequestBody = require("../utils/validateHelper");

const handleTicketBooking = async(req,res)=>{
    const {userId,movieId,screenId,showId,seats} = req.body;
    const validate = validateRequestBody(req.body,["userId","movieId","screenId","showId","seats"])
    if(validate){
        return res.status(400).json({message:validate})
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const screen = await Screen.findById(screenId).session(session)
        if(!screen){
            throw new Error("Screen not found")
        }

        const seatsAvailable = screen.seats.filter(s=>seats.some(seat=> seat.row == s.row && seat.number == s.number));
        
        if(seatsAvailable.some(s=>s.status == "booked")){
            return res.status(400).json({message:"Seats are already booked"})
        }

        const BookingResponse = new BookTicket({
            user:userId,
            movie:movieId,
            screen:screenId,
            show:showId,
            seats:seats,
        })
        

        const {setObj,arrayFilters} = buildSeatUpdate(seats,"hold","empty")
        await Screen.updateOne(
            {_id:screenId},
            {$set:setObj},
            {arrayFilters:arrayFilters,session}
        )
        //payment api is not initilized yet, till then consider payment is successfull for all bookings for testing.

        BookingResponse.status = "Confirmed"
        await BookingResponse.save({session})
        
        const{setObj:setObjBooked,arrayFilters:arrayFiltersBooked} = buildSeatUpdate(seats,"booked","hold")
        await Screen.updateOne(
            {_id:screenId},
            {$set:setObjBooked},
            {arrayFilters:arrayFiltersBooked,session}
        )

        await User.updateOne(
            {_id:userId},
            {$push:{Bookings:BookingResponse._id},},
            {session}
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json(BookingResponse)
        
    }catch(err){
        console.error(err.message)
        await session.abortTransaction();
        session.endSession()
        return res.status(500).json({message:"Internal server problem"})
        
    }
 }

 const handleTicketCancel = async(req,res)=>{
    const {bookingId,userId} = req.body;

    const validate = validateRequestBody(req.body,["bookingId","userId"]);
    if(validate){
        return res.status(400).json(validate)
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const booking = await BookTicket.findById(bookingId).populate(["show","movie"]);
        if(!booking){
            return res.status(404).json({message:"No booking found"})
        }
        
        
        const timeOfCancel = Date.now()
        const timeToStartShow = new Date(booking.show.showTime).getTime();

        if(!((timeOfCancel+(5*60*60*1000))<timeToStartShow)){
            return res.status(400).json({message:"Cancellation of ticket is stopped"})
        }
        
        const {setObj:setObjEmpty,arrayFilters:arrayFiltersEmpty} = buildSeatUpdate(booking.seats,"empty","booked")
        await Screen.updateOne(
            {_id:booking.screen},
            {$set:setObjEmpty},
            {arrayFilters:arrayFiltersEmpty,session}
        )
        await User.findByIdAndUpdate(
            {_id:userId},
            {$pull:{Bookings:bookingId}},
            {new:true},
            {session}
        )
        await BookTicket.findByIdAndDelete(bookingId).session(session)

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({message:"Ticket cancelled successfully"})

    }catch(err){
        console.error(err.message)
        await session.abortTransaction();
        session.endSession()
        return res.status(500).json({message:"Internal server problem"})
    }

 }

 const handleFetchBookings = async (req, res) => {
   const userId = req.user.userId;
   if (!userId) {
     return res
       .status(401)
       .json({ message: "user should be logged in to see bookings" });
   }
   try {
     const user = await User.findById(userId).populate("Bookings");

     const bookings = user.Bookings;
     return res.status(200).json({ status: "true", data: bookings });
   } catch (err) {
     console.error(err.message);
     throw new Error("Internal server problem");
   }
 };

 module.exports = {
   handleTicketBooking,
   handleTicketCancel,
   handleFetchBookings,
 };