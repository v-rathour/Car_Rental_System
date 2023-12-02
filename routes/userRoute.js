const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");



router.get("/register", userController.UserRegister);
router.get("/login", userController.UserLogin);
router.get("/userdashboard", userController.userDashboard);
router.get("/logout", userController.logout);

// Post Request
router.post("/register",userController.postRegister)
router.post("/login",userController.postLogin);

module.exports = router;