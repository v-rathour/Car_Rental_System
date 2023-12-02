const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');



const carSchema = mongoose.Schema({
    img:String,
    model:String,
    number:String,
    capacity:String,
    rent:String,
    status:{type:String,default:"Available"},
    customer:String,
    days:String,
    startdate:String,
    agency:String
  });
  
  
  
  const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    role:{type:String,required:true,default:"User"},
    cars:[carSchema]
  });
  
  
  
  
  //adding plugin to the user Schema
  userSchema.plugin(passportLocalMongoose);
  
  
  
  
  
  //creating mongoose model
  const CarSchema = mongoose.model("Car",carSchema);
  const UserSchema = mongoose.model("User",userSchema);
  
module.exports = {CarSchema,UserSchema};
