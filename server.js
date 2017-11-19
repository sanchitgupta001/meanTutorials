var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var config = require("./config")
var mongoose = require('mongoose'); // For connecting nodejs application to the database

var app = express();

mongoose.connect(config.database, { useMongoClient: true}, function(err){ // MongoDB driver deprecating the API used by mongoose's default connection logic; therefore use { useMongoClient: true}
	if(err){
		console.log(err);
	}
	else{
		console.log("Connected to the database");
	}
});

app.use(bodyParser.urlencoded({ extended: true}));
//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). 
//The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
app.use(bodyParser.json()); // For parsing JSON
app.use(morgan('dev')); // For logging request to the console/terminal

// Applicable for any route
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/views/index.html');
});

app.listen(config.port, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("Listening on port 8888");
	}
});