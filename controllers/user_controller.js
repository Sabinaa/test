// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing    : true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"user strict";

var mongoose=require("mongoose");

var Users=mongoose.model("Users");


exports.register=function(req,res){

    Users.findOne({user_name: req.body.username })
        .exec(function(err, user) {
            if (!user)
            {
                var user=new Users({firstname:req.body.fname,lastname:req.body.lname,user_name:req.body.username,password:req.body.password});
                user.save(function(err, results){
                    if(err){
                        console.log(err);
                    } else {
                        res.json({message:"Congratulations! Your registration is successful. Please Login."});
                    }
                });

            }
            else {
                res.json(403, {
                    message: "Username already exists."
                });
            }
        });
}
exports.editProfile=function(req,res){

    Users.findOne({user_name: req.body.username })
        .exec(function(err, user) {
            if (!user)
            {
                console.log("No user found.")
            }
            else {
                user.password=req.body.password;
                user.save();
                usersession = req.session;
                usersession.user=user;
                res.json({message:"User profile updated successfully."});
            }
        });
}
