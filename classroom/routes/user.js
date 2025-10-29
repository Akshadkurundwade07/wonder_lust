const express = require("express");
const router = express.Router();


// user 
// index route 
router.get("/",(req,res)=>{
    res.send("Get for users");
})

// show users 
router.post("/:id", (req,res)=>{
    res.send("post for users id ");
})

// post - users 
router.post("/",(req,res)=>{
    res.send("post for users")    

})

// delete route 
router.delete("/:id", (req,res) => {
    res.send("Delete for user id");
})

module.exports = router;