// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"user strict";

var mongoose = require("mongoose");
var session = require("express-session");
var Users = mongoose.model("Users");


exports.login = function(req, res) {

    var message;
    var status;
    usersession = req.session;

    Users.findOne({
        user_name: req.body.username
    }, function(err, user) {
        if (err) {
            console.log(err);
        }
        // Return if user not found in database
        if (!user) {
            message = "Please check your username";
            status = 403;
        } else if (user.password !== req.body.password) {
            message = "Please enter correct password";
            status = 403;
        } else {
            usersession.user = user;
            usersession.save();
            status = 200;
            message = usersession.user;
        }

        res.json(status, {
            message: message
        });
    });
};

exports.checkSession = function(req, res) {
    usersession = req.session;

    if (typeof usersession.user !== "undefined") {
        var data = usersession.user;
        res.json({
            message: data
        });
    } else {
        res.json(403, {
            message: "Please login."
        });
    }

};

exports.logout = function(req, res) {
    req.session.destroy();
    res.send("success");
};