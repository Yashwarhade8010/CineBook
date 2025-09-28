const {model,Schema} = require('mongoose');

const screenSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    seats:[]
})

screenSchema.pre("save",async function(next){
    if(this.seats.length>0) return next();

    const rows = ["A","B","C","D","E","F","G","H","I","J"]
    const seats =[];
    rows.forEach((row)=>{
        for(let i=0;i<=6;i++){
            seats.push({
                row:row,
                number:i,
                type:(row == "A" || row == "B") ? "PREMIUM" : "NORMAL",
                status:"empty"
            })
        }
    })

    this.seats = seats;
    next();
})

const Screen = model("Screen",screenSchema);

module.exports = Screen