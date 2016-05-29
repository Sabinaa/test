// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

var express = require("express"),
    http = require("http");
var path = require("path");
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://ketul:ketul@ds019063.mlab.com:19063/ketulshah");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var request = require("request");
var onlineusers = {};
require("./models/lnf_model.js");
var LostandFound = mongoose.model("LostandFound");

var session = require("express-session");

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.engine(".html", require("ejs").__express);
app.set("views", __dirname + "/views");
app.set("view engine", "html");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "RQSHJD23HG"
}));

require("./routes/index")(app);

io.on("connection", function(socket) {


    socket.on("addItem", function(msg) {

        var lf = new LostandFound(msg);

        lf.save();

        io.emit("itemAdded", lf);

        if (lf.found) {
            LostandFound.find({
                found: true
            }, function(err, founditems) {
                if (err) {
                    return console.error(err);
                }
                io.emit("updateFoundcount", founditems);
            });
        } else {
            LostandFound.find({
                lost: true
            }, function(err, lostitems) {
                if (err) {
                    return console.error(err);
                }
                io.emit("updateLostCount", lostitems);
            });
        }

    });
    socket.on("logout", function(data) {
        if (!socket.nickname) {
            return;
        }
        delete onlineusers[socket.nickname];

    });
    socket.on("postDelete", function(data, lOrf) {
        io.emit("delete post", data, lOrf);
        if (lOrf === "foundcount") {
            LostandFound.find({
                found: true
            }, function(err, founditems) {
                if (err) {
                    return console.error(err);
                }
                io.emit("updateFoundcount", founditems);
            });
        } else {
            LostandFound.find({
                lost: true
            }, function(err, lostitems) {
                if (err) {
                    return console.error(err);
                }
                io.emit("updateLostCount", lostitems);
            });
        }
    });
    socket.on("send message", function(receiver, data, callback) {
        var msg = data.trim();

        if (receiver in onlineusers) {
            onlineusers[receiver].emit("message", {
                msg: msg,
                nick: socket.nickname,
                rec: receiver
            });
            socket.emit("new message", {
                msg: msg,
                nick: socket.nickname,
                rec: receiver
            });


        } else {
            callback("Error!  Enter a valid user.");
        }
    });
    socket.on("updateSocket", function(username) {
        socket.nickname = username;
        onlineusers[username] = socket;

    });
    socket.on("onlineuser", function(data, callback) {
        if (data in onlineusers) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            onlineusers[socket.nickname] = socket;
        }
    });
    socket.on("check friend", function(friend, callback) {

        if (friend in onlineusers) {

            onlineusers[friend].emit("open window", {
                name: socket.nickname
            });
            callback(true);
        } else {
            callback(false);
        }

    });

});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

//server.listen(8000);
//console.log("Server started on port:8000");
