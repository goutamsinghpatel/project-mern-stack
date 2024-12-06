const  express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasyn.js")
const {reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
//valid schema midleware for review model//
const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.details.map(el => el.message).join(', ')); 
    }
    else{
        next();
    }
}
//review route//
//post//
router.post("/",validateReview,wrapAsync(async(req,res)=>{
   
    let listing =  await  Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success"," New review created");
  res.redirect(`/listings/${listing._id}`);
  }))
  // delete rout review//
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;
  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Review.findByIdAndDelete(reviewId)
   req.flash("success","review Deleted");
   res.redirect(`/listings/${id}`);
  }))

  module.exports=router;
  