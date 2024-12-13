const Listing=require("./models/listing");
const Review=require("./models/reviews.js");
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
        //redirect url save//
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must been  logged in to create listing")
       return res.redirect("/login");
    
    }
   next();
}

module.exports.saveredirect=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
     req.flash("error","You not owner of this");
  return   res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You not owner of this review");
  return   res.redirect(`/listings/${id}`); 
    }
    next();
}
//valid schema midleware for listings model//
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); 
    if (error) {

        throw new expressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};

//valid schema midleware for review model//
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400, error.details.map(el => el.message).join(', ')); 
    }
    else{
        next();
    }
}
