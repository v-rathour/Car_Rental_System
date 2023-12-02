
//requiring the packages

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//const abdac = require('./model/DataModel')
const User = require('./model/DataModel').UserSchema;
const Car = require('./model/DataModel').CarSchema;

const homepage = require("./routes/homepage");
 
const userRoute = require("./routes/userRoute");

const carRoute = require("./routes/carRoute");



//initialisation and setiing view engine etc.

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(session({
  secret:"codingblocks",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());




//connection to DB
mongoose.connect("mongodb+srv://Vikash_Rathour:Y3WmbXczS0mCLUZG@vikash01.ox2kbg7.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log('connection established')
  })





passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // persisteant login 
passport.deserializeUser(User.deserializeUser());



app.use(homepage);
app.use(userRoute);
app.use(carRoute);





//setting up server
app.listen(process.env.PORT||3000,function(){
  console.log("Server started.......3000");
});
      
