const express=require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasyn.js")
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const path=require("path");
app.set("view engine","ejs");
app.engine('ejs', ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((data)=>{
    console.log("ok");
})
.catch((err)=>{
   console.log(err);
})
//require modal//
const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const User=require("./models/user.js");
//session id//

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+30*24*60*60*1000,
        maxAge:30*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));
app.use(flash());
//passport//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//port
app.listen(port,()=>{
    console.log("server started")
});
//midlware to flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// all routes//

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);


// midlewarer//
app.use((err,req,res,next)=>{
    
    let{status=500,message=not}=err;
    res.status(status).render("listings/error.ejs",{message})

    res.status(status).send(message);
    
})

// app.all("*",wrapAsync((req,res,next)=>{
//     next(new expressError(400,"page not found"));
// }))

app.use((req,res,next)=>{
    res.send("page not found");
})

