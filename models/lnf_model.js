var mongoose = require('mongoose');

Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new mongoose.Schema({
	firstname:String,
	lastname:String,
	user_name: String,
	password:String
});

mongoose.model('Users',userSchema);


var lostandfoundSchema=new mongoose.Schema({
	location:String,
	name:String,
	description:String,
	date:String,
	lost:Boolean,
	found:Boolean,
	user:String,
    date_posted: Date,
    date_formated: String
});

mongoose.model('LostandFound',lostandfoundSchema);