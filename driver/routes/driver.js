const express = require("express"),
      router = express.Router(),
      bcrypt = require("bcryptjs"),
      passport = require("passport");

const Driver = require("../model/driver");
Cab = require("../model/cab");




//show login
router.get("/login", (req,res)=>{
    res.render("driver/login");
})

//login logic
router.post("/login",(req,res,next)=>{
    passport.authenticate("local",{
        successRedirect : "/",
        failureRedirect : "/driver/login",
        failureFlash : true
    })(req,res,next);

})


//show registe 
router.get("/register", (req,res)=>{
    res.render("driver/register");
})

//register logic
router.post("/register",(req,res)=>{
    const {name , phone, email, password, password2, license, carName, regNo} = req.body;
    let errors = []
    //Check fields
    if(!name, !phone, !email, !password, !password2, !license, !carName, !regNo){
        errors.push({msg:"All fields must be filled"});
    }

    //check password match
    if(password!=password2){
        errors.push({msg:"Passwords does not match!"});
    }

    //check length
    if(password.length<6){
        errors.push({msg:"Password must be atleast 6 charaters long"});
    }

    if(errors.length>0){
        res.render("driver/register",{ 
            errors,
            name,
            email,
            phone,
            license,
            carName,
            regNo
        })
    }


    //Validation passed
    Driver.findOne({email:email})
        .then(driver=>{
            //If exists
            if(driver){
                errors.push({msg:"User exists"});
                res.redirect("/drivers/login");
            }else{
                //new driver
                const newDriver = new Driver({
                    name,
                    password,
                    email,
                    license,
                    phone,
                    regNo,
                    carName
                });

                //Bcrypt password
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newDriver.password,salt, (err,hash)=>{
                        if(err) throw err;

                        newDriver.password = hash;
                        newDriver.save();
                        //done
                        req.flash("success_msg","Succesful! Now you may Login");
                        res.redirect("/driver/login");
                    })
                })
            }
        }).catch(err=>res.render("cust/register",{ msg: "Something went wrong"}))

    
});

//logout
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","You have logged out");
    res.redirect("/driver/login")
})


//dashboard
router.get("/dashboard/:id", (req,res)=>{
    Driver.findById(req.params.id).populate("cabs").exec((err,foundDriver)=>{
        if(err) throw err;

        res.render("driver/dashboard",{driver:foundDriver});
    })
})


module.exports = router;