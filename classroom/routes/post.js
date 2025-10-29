const express = require("express");
const router = express.Router();

// post 
// index route 
router.get("/",(req,res)=>{
    res.send("Get for posts");
});

// show users 
router.post("/:id", (req,res)=>{
    res.send("post for posts id ");
});

// post - users 
router.post("/",(req,res)=>{
res.send("post for posts")    

});

// delete route 
router.delete("/:id", (res,req) => {
    res.send("Delete for posts id");
});

module.exports = router;