const express = require("express"),
      router = express.Router();

      Cab = require("../model/cab");

//show one cab
router.get("/show/:id", (req,res)=>{
    Cab.findById(req.params.id,(err,foundCab)=>{

        if(err) throw err;
        res.render("cab/show", {cab: foundCab});

    }).catch(err=> console.log(err))
})

module.exports = router;