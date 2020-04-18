const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Cust = require("../model/cust");


//Function to set up passport for Customer model
async function passportConfig(passport){
    passport.serializeUser((cust, done)=>{
        done(null,  cust.id);
    });

    passport.deserializeUser((id,done)=>{
        Cust.findById(id, (err,cust)=>{
            done(err, cust);
        })
    });


    await passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done)=>{
            //Find customer
            Cust.findOne({email:email})
                .then(cust=>{
                    if(!cust){
                        //No Customer found
                        return done(null, false, {message : "User not found"})
                    }

                    //Cust exists
                    //Match password
                    bcrypt.compare(password, cust.password, (err,isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            //Matched
                            return done(null, cust );
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