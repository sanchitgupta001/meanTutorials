var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); // For hashing of the passwords

var UserSchema = new Schema({
	name: String,
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false} // select: false - To avoid password fetching while querying details
});

// For Hashing password field
UserSchema.pre('save', function(next){ // consult http://mongoosejs.com/docs/middleware.html
	var user = this;

	if(!user.isModified('password'))
		return next();

	bcrypt.hash(user.password, null, null, function(err, hash){ // consult https://github.com/shaneGirish/bcrypt-nodejs

		if(err){
			return next(err);
		}

		user.password = hash;
		next();

	});


});
module.exports = mongoose.model('User', UserSchema);