const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      Cust = require("../model/cust"),
      bcrypt = require("bcryptjs");


//Show login form 
router.get("/login",(req,res)=>{
        res.render("cust/login");
})

//Login logic
router.post("/login", (req,res,next)=>{
    passport.authenticate("local",{
        successRedirect : "/",
        failureRedirect : "/cust/login",
        failureFlash : true
    })(req,res,next);
})


//Show register form 
router.get("/register",(req,res)=>{
    res.render("cust/register");
})


//Register logic
router.post("/register", (req,res)=>{
    let errors = [];
    const { name , email,phone, password, password2 } = req.body;

    //Check all fields are filled or not
    if(!name, !email, !phone, ! password, !password2){
        errors.push({msg: "All fields must be filled"})
    }

    //Check password match
    if(password!=password2){
        errors.push({msg: "Password does not match"})
    }

    //Check length
    if(password.lenght<6){
        errors.push({msg:"Password must be atleast 6 characters long"})
    }

    //check errors
    if(errors.length>0){
        res.render("cust/register",{
            errors,
            name,
            phone,
            email
        })
    }
    else{
        //No errors
        Cust.findOne({email:email})
            .then(cust=>{
                //User exists
                if(cust){
                    errors.push({msg:"User Already exists"})
                    res.render("cust/register",{
                        errors,
                        name,
                        phone,
                        email
                    })
                }else{
                    //New User
                    const newCust = new Cust({
                        name,
                        email,
                        password,
                        phone
                    });

                    //Hash password
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newCust.password,salt, (err,hash)=>{
                            if(err) throw err;
                            //Set password to hash
                            newCust.password = hash;
                            newCust.save();
                            req.flash("success_msg","You are now registered and can log in !!");
                            res.redirect("/cust/login");
                        })
                    });
        
                  
                }
            }).catch(err=>res.render("cust/register",{ msg: "Something went wrong"}))
    }

})

//logout
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","You have logged out");
    res.redirect("/cust/login")
})

//dashboard
router.get("/dashboard/:id",isLoggedIn, (req,res)=>{
    Cust.findById(req.params.id)
        .populate({path: 'cabs', options:{sort : {'created_at': 1}}}).exec((err,foundCust)=>{
        if(err) throw err;
        res.render("cust/dashboard",{cust:foundCust});
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error_msg","You must be logged in!")
    res.redirect("/cust/login");
}






module.exports = router