const express=require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasyn.js")
const expressError=require("./utils/expressError.js");
const {listingSchema}=require("./schema.js");
const path=require("path");
app.set("view engine","ejs");
app.engine('ejs', ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((data)=>{
    console.log("ok");
})
.catch((err)=>{
   console.log(err);
})
//require modal//
const Listing=require("./models/listing.js");

app.listen(port,()=>{
    console.log("server started")
});


// index route///

app.get("/listings",wrapAsync( async(req,res)=>{
  const allListings= await Listing.find({});

res.render("listings/index.ejs",{allListings});

}))

//new route//
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//valid schema midleware//
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); 
    if (error) {

        throw new expressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};
//create route//
app.post("/listings/create",validateListing,wrapAsync( async(req,res,next)=>{
    // let {title,decription,country,price,location,image}=req.body;

let newListing=new Listing(req.body.Listing);
    await newListing.save();
     res.redirect("/listings");
    
}))
   



//show route//

app.get("/listings/:id",wrapAsync(async(req,res)=>{

    let {id}=req.params;
let showListings=await Listing.findById(id);

res.render("listings/show.ejs",{showListings});
}))
// edit route//
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);
res.render("listings/edit.ejs",{showListings});

}))
//update route//
app.patch("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    if(! req.body.Listing){
        throw new expressError(400,"send valid data for listings")
    }
       
 await Listing.findByIdAndUpdate(id,{...req.body.Listing})
 res.redirect("/listings")
}))


//Delete route//
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}))
// midlewarer//
app.use((err,req,res,next)=>{
    
    let{status=500,message=not}=err;
    res.status(status).render("listings/error.ejs",{message})

    res.status(status).send(message);
    
})

app.all("*",(req,res,next)=>{
    next(new expressError(400,"page not found"));
})

