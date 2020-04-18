const express = require("express"),
      router = express.Router();


router.get("/",(req,res)=>{
        res.render("landing");
    })

router.get("/login",(req,res)=>{
    res.render("loginCheck");
})

router.get("/register",(req,res)=>{
    res.render("registerCheck");
})

router.get("/", (req,res)=>{})

module.exports = router