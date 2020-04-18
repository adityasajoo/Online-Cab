const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      session = require("express-session"),
      flash = require("connect-flash"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      passport = require("passport"),
      passportConfig = require("./config/passport-config");
// require("dotenv").config();

//use ejs
app.set("view engine","ejs");

//Serve Public
app.use(express.static(__dirname+"/public"));



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
        expires : 600000,
    },
}));

//Initialize passport 
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);



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





//Connect to db
const url = "mongodb+srv://cabonline:cab123@cluster0-9apnr.mongodb.net/test?retryWrites=true&w=majority" 
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to Mongo");
}).catch(err =>{
    console.log("Problem with the database !!")
})

//routes
app.use("/",require("./routes/start"));
app.use("/driver", require("./routes/driver"));
app.use("/cab", require("./routes/cab"));



PORT = process.env.PORT||80
app.listen(PORT, console.log("All ok at port : "+PORT));