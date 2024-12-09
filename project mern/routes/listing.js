const  express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasyn.js")
const {isOwner,validateListing}=require("../middleware.js");
//require modal//
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

// index route///

router.get("/",wrapAsync( async(req,res)=>{
    const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});
  
  }))
  
  //new route//
  router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
      
  })


  //create route//
  router.post("/create",isLoggedIn,validateListing,wrapAsync( async(req,res,next)=>{
let newListing=new Listing(req.body.Listing);
newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
     res.redirect("/listings");

}))
   
//show route//

router.get("/:id",wrapAsync(async(req,res)=>{

    let {id}=req.params;
let showListings=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
if(!showListings){
    req.flash("error","Listing  does not exist");
    res.redirect("/listings")
}
res.render("listings/show.ejs",{showListings});
}))
// edit route//
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);
if(!showListings){
    req.flash("error","Listing  does not exist");
    res.redirect("/listings")
}
res.render("listings/edit.ejs",{showListings});

}))
//update route//
router.patch("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.Listing})
 req.flash("success","Listing Updated");
 res.redirect("/listings")
}))


//Delete route//
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
    res.redirect("/listings")
}))

module.exports=router;