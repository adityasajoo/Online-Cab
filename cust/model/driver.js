const mongoose = require("mongoose");
const random = require("mongoose-simple-random");


const driverSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            min : 4
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            min : 6
        },
        phone : {
            type : String,
            required : true
        },
        cabs : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Cab"
            }
        ],
        license :{
            type: String,
            required : true
        },
        
        regNo :{
            type: String,
            required : true,
            unique : true
        },
        carName:{
            type: String,
            required: true
        }
    },
    {timestamps : true }
)

driverSchema.plugin(random);

const Driver = mongoose.model('Driver' , driverSchema)

module.exports = Driver