const express = require("express");
const app = express();
const users  = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session"); 
const flash = require("connect-flash");

app.use(flash());

const sessionOptions = {secret : "mysupersecretstring",
    resave: false,
    svaeUninitialized: true
};
app.use(session(sessionOptions));

app.get("/register",(req,res)=>{    
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");
    req.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.send("hello world");
});


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
    
//     res.send(`you sent a req ${req.session.count} times`);
// });
// // const cookieParser = require("cookie-parser");

// app.use(cookieParser());

// app.get("/getcookies",(req,res)=> {
//     res.cookie("greet","hello!");
//     res.send("sent you the cookie");
// })
// app.get ("/", (req,res) => {
//     console.log(req.cookies)
//     res.send("Hi ,I am root!");
// });

// app.use("/users",users);
// app.use("/posts",posts);



app.listen(3000, () => {
    console.log("server is listening to 3000");
}) 