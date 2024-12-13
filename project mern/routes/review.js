const  express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasyn.js")
const {reviewSchema}=require("../schema.js");
const expressError=require("../utils/expressError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//review route//
//post//
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  // delete rout review//
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

  module.exports=router;
  