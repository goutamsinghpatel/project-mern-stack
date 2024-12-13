const  express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasyn.js")
const {isOwner,validateListing}=require("../middleware.js");
//multer//
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});//
//controller//
const listingCOntroller=require("../controllers/listings.js")
//require modal//
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

// index route///

router.get("/",wrapAsync(listingCOntroller.index));
  
  //new route//
  router.get("/new",isLoggedIn,listingCOntroller.renderNewForm);


  // create route//
  // router.post("/create",isLoggedIn,validateListing,wrapAsync(listingCOntroller.createListing));
router.post("/create",upload.single('listing[Image]'), (req,res)=>{
  
  res.send(req.file);
})
router.route("/:id")
//show route//
.get(wrapAsync(listingCOntroller.showListings))
//update route//
.patch(isLoggedIn,isOwner,validateListing,wrapAsync(listingCOntroller.updateListing))
//Delete route//
.delete(isLoggedIn,isOwner,wrapAsync(listingCOntroller.destroyListing));

// edit route//
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingCOntroller.renderEditForm));

module.exports=router;