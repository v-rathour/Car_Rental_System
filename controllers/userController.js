const User = require('../model/DataModel').UserSchema;
const Car = require('../model/DataModel').CarSchema;

const passport = require("passport");

const UserLogin = function (req, res) {
    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "User") {
            res.redirect("/userdashboard");
        }

        else {
            res.redirect("/agencydashboard");
        }
    }
    else {
        res.render("login");
    }
};
const UserRegister = function (req, res) {
    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "User") {
            res.redirect("/userdashboard");
        }

        else {
            res.redirect("/agencydashboard");
        }
    }
    else {
        res.render("register");
    }

};
const userDashboard = function (req, res) {
    if (req.isAuthenticated()) {
        const role = req.user.role;
        if (role == "User") {
            const userid = req.user._id;
            User.findOne({ _id: userid }, function (err, foundUser) {
                res.render("userdashboard", { cars: foundUser.cars })
            });
        }

        else {
            res.redirect("/agencydashboard")
        }
    }


    else {
        res.redirect("/login");
    }
};
const logout = function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/");
};
const postRegister = function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;
    const name = req.body.name;
    const role = req.body.role;
    


    User.register({ username: userName, name: name, role: role }, passWord, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }

        else {
            passport.authenticate("local")(req, res, function () {
                if (role == "User") {
                    res.redirect("/bookcars");
                }

                else {
                    res.redirect("agencydashboard")
                }

            });
        }
    });

};
const postLogin=function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;

    const user = new User({
        username: userName,
        password: passWord
    });


    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }

        else {
            passport.authenticate("local")(req, res, function () {

                res.redirect("/bookcars");

            });
        }
    });

}
module.exports = { UserLogin, UserRegister ,userDashboard,logout,postRegister,postLogin};