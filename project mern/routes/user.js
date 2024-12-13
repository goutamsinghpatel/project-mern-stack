const  express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasyn.js")
const expressError=require("../utils/expressError.js");
const User=require("../models/user.js");
const passport = require("passport");
const {saveredirect}=require("../middleware.js");
const userControll=require("../controllers/users.js");

//signup//
router.route("/signup")
.get(userControll.renderSignupForm)
.post(wrapAsync(userControll.signup));
//login//
router.route("/login")
.get(userControll.renderLoginForm)
.post(saveredirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControll.login);
//logout
router.get("/logout",userControll.logout)

module.exports=router;
