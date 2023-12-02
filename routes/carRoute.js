const express = require('express');
const router = express.Router();
const carController = require("../controllers/carController");
// User book car 
router.get("/bookcars", carController.bookcars);
// User add a car
router.get("/bookedcars", carController.bookingAgency);
// Add new car
router.get("/addnewcars", carController.addnewcars);
router.get("/agencydashboard",carController.agencydashboard);

// Post Request
router.post("/addnewcars", carController.postaddnewcar);
router.post("/bookcars",carController.postBookingcar );
router.post("/bookthiscar",carController.postbookingthiscar);
router.post("/agencydashboard",carController.postagencydashboard);
router.post("/updatethiscar",carController.postupdatecar );
router.post("/userdashboard", carController.cancelbooking);


module.exports = router;