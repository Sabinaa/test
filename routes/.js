var express = require("express");
//var router = express.Router();

module.exports=function(app,passport){

    var lostandfound=require('../controllers/lostandfound.js');
    var auth=require('../controllers/auth_controller.js');
    var users=require('../controllers/user_controller.js');

    app.get("/", function(req, res) {
        app.use(express.static('public'));
        res.render("index", { title: "LostAndFound" });
    });

    app.get("/getAllLostItems",lostandfound.getAllLostItems);
    app.get("/getAllFoundItems",lostandfound.getAllFoundItems);
    app.post("/register",users.register);
    app.post("/login", auth.login);
    app.get("/logout",auth.logout);
    app.post("/editProfile",users.editProfile);
    app.get("/checkSession",auth.checkSession);
    app.get("/getAllUsers",users.getAllUsers);
}

