const  express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasyn.js")
const {listingSchema}=require("../schema.js");
const {reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");
//require modal//
const Listing=require("../models/listing.js");

//valid schema midleware for listings model//
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); 
    if (error) {

        throw new expressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};
// index route///

router.get("/",wrapAsync( async(req,res)=>{
    const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});
  
  }))
  
  //new route//
  router.get("/new",(req,res)=>{
      res.render("listings/new.ejs");
  })


  //create route//
  router.post("/create",validateListing,wrapAsync( async(req,res,next)=>{
let newListing=new Listing(req.body.Listing);
    await newListing.save();
    req.flash("success","New Listing Created");
     res.redirect("/listings");
    
}))
   
//show route//

router.get("/:id",wrapAsync(async(req,res)=>{

    let {id}=req.params;
let showListings=await Listing.findById(id).populate("reviews");
if(!showListings){
    req.flash("error","Listing  does not exist");
    res.redirect("/listings")
}
res.render("listings/show.ejs",{showListings});
}))
// edit route//
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);
if(!showListings){
    req.flash("error","Listing  does not exist");
    res.redirect("/listings")
}
res.render("listings/edit.ejs",{showListings});

}))
//update route//
router.patch("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    if(! req.body.Listing){
        throw new expressError(400,"send valid data for listings")
    }
       
 await Listing.findByIdAndUpdate(id,{...req.body.Listing})
 req.flash("success","Listing Updated");
 res.redirect("/listings")
}))


//Delete route//
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
    res.redirect("/listings")
}))

module.exports=router;