const mongoose = require("mongoose");

const custSchema = mongoose.Schema(
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
        ]
    },
    {timestamps : true }
)

const Cust = mongoose.model('Cust' , custSchema)

module.exports = Cust