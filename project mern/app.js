const express=require("express");
const app=express();
const mongoose = require("mongoose");
const port=8080;
const ejsMate=require("ejs-mate");
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

app.get("/listings",async(req,res)=>{
  const allListings= await Listing.find({});

res.render("listings/index.ejs",{allListings});

})

//new route//
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
//create route//
app.post("/listings/create",async(req,res)=>{
    // let {title,decription,country,price,location,image}=req.body;
    let newListing=new Listing(req.body.Listing);
await newListing.save();
 res.redirect("/listings");
})


//show route//

app.get("/listings/:id",async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);

res.render("listings/show.ejs",{showListings});
})
// edit route//
app.get("/listings/:id/edit",async(req,res)=>{
let {id}=req.params;
let showListings=await Listing.findById(id);
res.render("listings/edit.ejs",{showListings});

})
//update route//
app.patch("/listings/:id",async(req,res)=>{
    let {id}=req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.Listing})
 res.redirect("/listings")
})

//Delete route//
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
  await  Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})