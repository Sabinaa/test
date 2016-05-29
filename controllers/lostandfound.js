// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";

var mongoose = require("mongoose");

var LostandFound = mongoose.model("LostandFound");

exports.getAllLostItems = function(req, res) {
    LostandFound.find({
        lost: true
    }, function(err, lostitems) {
        if (err) {
            return console.error(err);
        }
        res.json({
            message: lostitems
        });
    });
};

exports.getAllFoundItems = function(req, res) {

    LostandFound.find({
        found: true
    }, function(err, founditems) {
        if (err) {
            return console.error(err);
        }
        res.json({
            message: founditems
        });
    });
};

exports.postDelete = function(req, res) {
    LostandFound.findOne({
        _id: req.body.item
    }).remove(function(err) {
        if (err) {
            res.send({
                success: false
            });
        } else {
            res.send({
                success: true
            });
        }
    });
};