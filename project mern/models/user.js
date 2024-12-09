const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    
    },

})

userSchema.plugin(passportLocalMongoose);
// plugin=>here passport-local mongoose will add a username and hash passport//
module.exports=mongoose.model("User",userSchema);

