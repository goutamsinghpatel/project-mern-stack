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
    // let {title,decription,country,price,location,image}=req.body;

let newListing=new Listing(req.body.Listing);
    await newListing.save();
     res.redirect("/listings");
    
}))
   
//show route//

router.get("/:id",wrapAsync(async(req,res)=>{

    let {id}=req.params;
let showListings=await Listing.findById(id).populate("reviews");

res.render("listings/show.ejs",{showListings});
}))
// edit route//
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);
res.render("listings/edit.ejs",{showListings});

}))
//update route//
router.patch("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    if(! req.body.Listing){
        throw new expressError(400,"send valid data for listings")
    }
       
 await Listing.findByIdAndUpdate(id,{...req.body.Listing})
 res.redirect("/listings")
}))


//Delete route//
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))

module.exports=router;