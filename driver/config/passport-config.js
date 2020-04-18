const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Driver = require("../model/driver");


//Function to set up passport for Driver model
async function passportConfig(passport){
    passport.serializeUser((driver, done)=>{
        done(null,  driver.id);
    });

    passport.deserializeUser((id,done)=>{
        Driver.findById(id, (err,driver)=>{
            done(err, driver);
        })
    });


    await passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done)=>{
            //Find Driver
            Driver.findOne({email:email})
                .then(driver=>{
                    if(!driver){
                        //No Driver found
                        return done(null, false, {message : "User not found"})
                    }

                    //Driver exists
                    //Match password
                    bcrypt.compare(password, driver.password, (err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            //Matched
                            return done(null, driver );
                        }

                        else{
                            //Wrong Password
                            return done(null, false, {message: "Password does not match"});
                        }
                    })
                }).catch(err=> console.log(err))
        })
    )

}




module.exports = passportConfig;