const  express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasyn.js")
const expressError=require("../utils/expressError.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveredirect}=require("../middleware.js");
//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})
//signup
router.post("/signup",wrapAsync(async(req,res)=>{
try{

    let{username,email,password}=req.body;
let user=new User({email,username})
let resisterUser=await  User.register(user,password);
req.login(resisterUser,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","WelCome to Wanderlust");
res.redirect("/listings");
})

}
catch(err){
    req.flash("error",err.message)
    res.redirect("/signup")
}
}))
//login
router.get("/login",(req,res)=>{
    
    res.render("users/login.ejs")
})
//login//
router.post("/login",saveredirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{ 
    req.flash("success","WelCome  back to Wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

       
})
//logout//
router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are loged out now")
      res.redirect("/listings");
    })
})
module.exports=router;
