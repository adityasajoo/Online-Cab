const mongoose = require("mongoose");


const cabSchema = new mongoose.Schema({
    pickup:{
        type : String,
        required : true
    },
    drop:{
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time :{
        type :String,
        required : true
       },
    customerName:{
        type : String,
        required : true
    },

    driverName:{
        type : String,
        required : true
    },
    fare:{
        type : Number,
        required : true
    },
    regNo:{
        type:String,
        required : true
    },
    carName:{
        type : String,
        required: true
    } 
    },
    {timestamps : true}
)

const Cab = mongoose.model('Cab' , cabSchema)

module.exports = Cab