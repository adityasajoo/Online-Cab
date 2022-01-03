"use strict"
const express = require("express"),
      app    = express(),
      session = require("express-session"),
      flash = require("connect-flash"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      passportConfig = require("./config/passport-config");
     
//  require("dotenv").config();

//set ejs as default
app.set("view engine","ejs")

//Serve public directory
app.use(express.static(__dirname+"/public"))

//Use Body parser 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//cookie parser
app.use(cookieParser());


//setup express session
//Express session
app.use(session({
    name : 'session-id',
    secret : "This is mini",
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : 6000000,
    },
}));

//Initialize passport 
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);


//Connect to mongo
const url = "Your Mongo URL" 
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to Mongo");
}).catch(err =>{
    console.log("Problem with the database !!")
})


//use flash
app.use(flash())

//Global vars
app.use((req,res,next)=>{

    res.locals.currentUser = req.user;
    res.locals.nowDate = today();

    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();
})


//Find todays date
function today(){
    const todayDate = new Date();
    return todayDate.toISOString().substr(0,10);
}



//Routes
app.use("/", require("./routes/start"))
app.use("/cust", require("./routes/cust"))
app.use("/cab", require("./routes/cabs"))



const PORT = process.env.PORT||3000;
app.listen(PORT, console.log("All Ok at the port :"+PORT))















