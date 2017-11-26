// Contains code for building API

var User = require('../models/user');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require("jsonwebtoken");

function creatToken(user){
	var token = jsonwebtoken.sign({
		_id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: '1440m' // expiresInMinutes is deprecated; now expiresIn is used; Here, 'm' denotes minutes
	});

	return token; // This token can only be decoded using the secretKey
}
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

		User.find({}, function(err,users){ // {} for fetching all the users from the mongodb
			if(err){
				res.send(err);
				return;
			}

			res.json(users); 
		});
	});


	api.post('/login',function(req,res){

		User.findOne({
			username: req.body.username
		}).select('password').exec(function(err, user){
			if(err){
				throw err;
			}

			if(!user){
				res.send({message: "User does not exist"});
			}
			else if(user){
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword){
					res.send({message: "Invalid Password"});
				}
				else{
					var token = creatToken(user);

					res.json({
						success: true,
						message: "Successfully login!",
						token: token
					});
				}
			}
		});

	});

	// Middleware to check if the token is valid or not

	app.use(function(req, res, next){

		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param['token'] || req.headers['x-access-token'];

		// check for token existence
		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){

				if(err){
					res.status(403).send({success: false, message: "Failed to authenticate the user"});
				}
				else{
					req.decoded = decoded;

					next();
				}
			});
		}
		else{
			res.status(403).send({success: false, message: "No token is provided"});
		}
	});


	return api;

}
