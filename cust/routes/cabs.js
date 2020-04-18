const express = require("express"),
       router = express.Router();

const Cust = require("../model/cust"),
      Driver = require("../model/driver"),
      Cab  = require("../model/cab");

router.get("/new",isLoggedIn, (req,res)=>{
    res.render("cab/new")
})

router.post("/new",isLoggedIn, async (req,res)=>{
    const {pickup, drop, date, time } = req.body;


    //find the user 
      Cust.findOne(req.user._id,(err,foundCust)=>{
        if(err) throw err;

        //found the user 
        //2 function : i) Create a new cab , ii) Add the cab to the user 
        //(i)Create the cab
        const fare= 120.00;
        const newCab = new Cab({
            pickup,
            drop,
            date,
            time,
            fare
        });

        //Add the customer name and driver name
        //find the driver
        Driver.findOneRandom( (err,foundDriver)=>{
            if(err) throw err;

            newCab.customerName = foundCust.name;
            newCab.driverName = foundDriver.name;
            newCab.carName = foundDriver.carName;
            newCab.regNo = foundDriver.regNo;
            newCab.save();

            //Add the cab to the driver
            foundDriver.cabs.push(newCab);
            foundDriver.save();
            //(ii)Add this cab to the user/
            foundCust.cabs.push(newCab);
            foundCust.save();

        })
       
        req.flash("success_msg","Cab successfully booked !!")
        res.redirect("/cust/dashboard/"+foundCust._id);
        
    }) 


       

})


//show one cab
router.get("/show/:id",isLoggedIn, (req,res)=>{
    Cab.findById(req.params.id,(err,foundCab)=>{

        if(err) throw err;
        const date = dateFind(foundCab.date);
        res.render("cab/show", {cab: foundCab, date: date});

    }).catch(err=> console.log(err))
})


//Check logged in or not

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error_msg","You must be logged in!")
    res.redirect("/cust/login");
}


//find day ,month and year
function dateFind(date){
    date = date.slice('-');
    let month = parseInt(date[1]);
    if(month==1) month= "January";
     if(month==2) month = "February";
     if(month==3) month= "March";
     if(month==4) month= "April";
     if(month==5) month= "May";
     if(month==6) month= "Jun";
     if(month==7) month= "July";
     if(month==8) month= "August";
     if(month==9) month= "September";
     if(month==10) month= "October";
     if(month==11) month= "November";
     if (month==12) month= "December";

    let day = date[2].toString();
    let year = date[1].toString();
    let newDate = day+" "+month+" "+year;
    return newDate;
}

module.exports = router;