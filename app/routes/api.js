// Contains code for building API

var User = require('../models/user');
var config = require('../../config');

var secretKey = config.secretKey;

module.exports = function(app, express){

	var api = express.Router();

	api.post('/signup', function(req,res){ // request and response parameters
		var user = new User({
			name: req.body.name, // Body parser
			username: req.body.username,
			password: req.body.password
		});

		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({ message: "User has been Created!"});
		});
	});

	api.get('/users', function(req,res){

		User.find({}, function(err,users){
			if(err){
				res.send(err);
				return;
			}

			res.json(users);
		});
	});


	return api;

}
