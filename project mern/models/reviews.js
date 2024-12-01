const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema=new Schema({
    
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:String,
    createdAt:{
        type:Date,
        defualt:Date.now(),

    }
});


module.exports=mongoose.model("Review",reviewSchema);
