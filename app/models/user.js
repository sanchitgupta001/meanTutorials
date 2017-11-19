var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	username: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true, select: false} // select: false - To avoid password fetching while querying details
});


module.exports = mongoose.model('User', UserSchema);