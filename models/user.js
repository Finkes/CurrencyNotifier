var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pusher = require('../libs/pusher');

//User
var UserSchema = new Schema({
	currencies: [{
		type: Schema.Types.ObjectId,
		ref: 'Currency',
		index: true
	}]
}, {
	collection: 'users'
});

/**
 * Send a push notification to a user. Channel is a unique user id
 */
UserSchema.methods.sendPush = function(data, cb) {
	var self = this;
	pusher.trigger(self._id.toString(), 'currencyGoUp', {
		message: data.codestring + 'has gone up'
	});
};

module.exports = mongoose.model('User', UserSchema);
