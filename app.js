const express = require('express');
const mongoose = require('mongoose');
const path = require("path");   
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter= require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');


const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); 
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


main()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(8080,() => {
        console.log('Server is running on port 8080');
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  async function main(){
  mongoose.connect("mongodb://localhost:27017/wanderlust", {
  });
}


const sessionOptions = {
    secret : "thisisasecretkey",
    resave: false,
    saveUninitialized: true,    
    cookie:{
      expires: Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,//security purpose

    }
};

app.use(session(sessionOptions)); 
app.use(flash());

app.use (passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());  

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//       email: "student@gmail.com",
//       username: "delt-user"
//     });

//     let registerdUser = await User.register(fakeUser,"helloworld");
//     res.send(registerdUser);
//   })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));

});

app.use((err,req,res,next)=> { 
  let{statusCode=500, message="something went wrong"} = err; 
  res.status(statusCode).render("error.ejs", {err});
})