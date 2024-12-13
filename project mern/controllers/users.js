const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup=async(req,res)=>{
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
    }
    module.exports.renderLoginForm=(req,res)=>{
    
        res.render("users/login.ejs")
    }
    module.exports.login=async(req,res)=>{ 
        req.flash("success","WelCome  back to Wanderlust");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    
           
    }
    module.exports.logout=(req,res,next)=>{
        req.logOut((err)=>{
            if(err){
                next(err);
            }
            req.flash("success","you are loged out now")
          res.redirect("/listings");
        })
    }