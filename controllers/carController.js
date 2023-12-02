const User = require('../model/DataModel').UserSchema;
const Car = require('../model/DataModel').CarSchema;

const bookcars = function (req, res) {


    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "Agency") {
            res.redirect("/agencydashboard");
        }

        else {
            Car.find({ status: { $ne: "Booked" } }, function (err, cars) {
                res.render("bookcars", { cars: cars });
            });
        }
    }

    else {
        Car.find({ status: { $ne: "Booked" } }, function (err, cars) {
            res.render("bookcars", { cars: cars });
        });
    }
}
// book for agency
const bookingAgency = function (req, res) {

    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "Agency") {

            const agencyid = req.user._id;

            User.findOne({ _id: agencyid }, function (err, foundAgency) {
                const cars = foundAgency.cars;
                let bookedcars = cars.filter(function (currentCar) {
                    return currentCar.status == "Booked";
                });

                res.render("bookedcars", { cars: bookedcars });

            });


        }

        else {
            res.redirect("/bookcars");
        }

    }
    else {
        res.redirect("/login");
    }
};
const addnewcars = function (req, res) {

    if (req.isAuthenticated()) {
        
        const role = req.user.role;
        if (role == "Agency") {
            res.render("addnewcars");
        }
        else {
            res.redirect("/bookcars");
        }
    }

    else {
        res.redirect("/login")
    }
};
const agencydashboard = function (req, res) {
    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "Agency") {
            const agencyid = req.user._id;
            User.findOne({ _id: agencyid }, function (err, foundAgency) {
                res.render("agencydashboard", { cars: foundAgency.cars })
            });
        }
        else {
            res.redirect("/userdashboard");
        }
    }

    else {
        res.redirect("/login");
    }
}
// post requests
const postaddnewcar=function (req, res) {

    if (req.isAuthenticated()) {

        const role = req.user.role;

        if (role == "Agency") {
            const id = req.user._id;

            const car = new Car({
                img:req.body.img,
                model: req.body.model,
                number: req.body.number,
                capacity: req.body.capacity,
                rent: req.body.rent,
                agency: req.user.username,

            });

            car.save();

            User.findOne({ _id: id }, function (err, foundUser) {
                if (!err) {
                    foundUser.cars.push(car);
                    foundUser.save();
                    res.redirect("/agencydashboard");
                }
            });
        }

        else {
            res.redirect("/bookcars")
        }
    }


    else {
        res.redirect("/login");
    }
}
const postBookingcar =function(req,res){
    if(req.isAuthenticated()){
      const role = req.user.role;
      if(role == "User"){
       
        const book = req.body.book;
        
        Car.findOne({_id:book},function(err,car){
            // console.log(_id )
           if(!err){
            
             res.render("bookthiscar",{car:car});
           }
        });
      }
      else{
        res.redirect("/agencydashboard");
      }
    }
    else{
      res.redirect("/login");
    }
    };
const postbookingthiscar=function (req, res) {
    if (req.isAuthenticated()) {
        const book = req.body.book;
        const agency = req.body.agency;
        const user = req.user.name;
        const startdate = req.body.startdate;
        const days = req.body.days;
        const car = new Car({
            _id: book,
            img: req.body.img,
            model: req.body.model,
            number: req.body.number,
            capacity: req.body.capacity,
            rent: req.body.rent,
            startdate: startdate,
            days: days

        });
        User.findOne({ _id: req.user._id }, function (err, foundUser) {
            if (!err) {
                foundUser.cars.push(car);
                foundUser.save();
            }

        });
        Car.findOneAndUpdate({ _id: book }, { $set: { "status": "Booked", "customer": user, "startdate": startdate, "days": days } }, function (err) {
            if (!err) {

                User.findOneAndUpdate({ username: agency, "cars._id": book }, { $set: { "cars.$.status": "Booked", "cars.$.customer": user, "cars.$.startdate": startdate, "cars.$.days": days } }, function (err) {

                    if (!err) {
                        res.redirect("/userdashboard");
                    }

                });
            }

        });

    }
    else {
        res.redirect("/login");
    }
}
const postagencydashboard = function (req, res) {
    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "Agency") {
            const carid = req.body.carid;
            Car.findOne({ _id: carid }, function (err, foundCar) {
                res.render("updatethiscar", { car: foundCar });
            });

        }

        else {
            res.redirect("/userdashboard");
        }
    }


    else {
        res.redirect("/login");
    }
};
const postupdatecar =function(req,res){
    const img = req.body.img;
    const id = req.body.update;
    const model = req.body.model;
    const number = req.body.number;
    const rent = req.body.rent;
    const status = req.body.status;
    const capacity = req.body.capacity;
    const agency = req.user.username;
   if(req.isAuthenticated()){
  
  
     Car.findOneAndUpdate({_id:id},{ $set: {"img":img,"model":model,"number":number,"rent":rent,"status":status,"capacity":capacity}},function(err){
         if(!err){
  
            User.findOneAndUpdate({username:agency,"cars._id":id},{$set:{"cars.$.status":status,"cars.$.model":model,"cars.$.number":number,"cars.$.rent":rent,"cars.$.capacity":capacity ,"cars.$.img":img}},function(err){
  
                if(!err){
                     console.log("Ok");
                }
  
               });
         }
  
     });
  
  
  
  
  if(status == "Booked"){
    const customer = req.body.customer;
    User.findOneAndUpdate({name:customer,"cars._id":id},{$set:{"cars.$.status":status,"cars.$.model":model,"cars.$.number":number,"cars.$.rent":rent,"cars.$.capacity":capacity}},function(err){
  
        if(!err){
             res.redirect("/agencydashboard");
        }
  
       });
  }
  
  
  else{
    const customer = req.body.customer;
    User.findOneAndUpdate({name:customer},{$pull:{cars:{_id:id}}},function(err,foundUser){
    if(!err){
      res.redirect("/agencydashboard");
    }
  });
  
  }
  
  
  
  
  
  
   }
   else{
     res.redirect("/login");
   }
  
  };
  const cancelbooking = async function (req, res) {
    try {
      if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "User") {
          const carid = req.body.carid;
          const user = req.user._id;
  
          // Remove car from user
          await User.findOneAndUpdate(
            { _id: user },
            { $pull: { cars: { _id: carid } } }
          );
  
          console.log("Car removed from user");
          console.log(carid);
          console.log(user);
  
          // Update car status to "Available"
          await Car.findOneAndUpdate({ _id: carid }, { $set: { status: "Available" } });
  
          console.log("Car status updated to Available");
  
          // Update car status in the agency's inventory
          const foundCar = await Car.findOne({ _id: carid });
          const agency = foundCar.agency;
  
          await User.findOneAndUpdate(
            { username: agency, "cars._id": carid },
            { $set: { "cars.$.status": "Available" } }
          );
  
          console.log("Car status updated in agency's inventory");
  
          res.redirect("/userdashboard");
        } else {
          res.redirect("/agencydashboard");
        }
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.error("Error in cancelbooking:", err);
      res.status(500).send("Internal Server Error");
    }
  };
  
  
module.exports = {
    bookcars, bookingAgency, addnewcars, postaddnewcar, postBookingcar, postbookingthiscar, postagencydashboard,
    postupdatecar,cancelbooking , agencydashboard      
}