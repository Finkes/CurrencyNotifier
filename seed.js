var base = require('./models');
var async = require('async');
console.log('Seeding db ...');


async.waterfall([

	function(cb) {
		base.Currency.remove({}, function(err) {
			cb(err);
		});
	},
	function(cb) { //removes all users
		base.User.remove({}, function(err) {
			cb(err);
		});
	},
	function(cb) {
		base.User.create({ //creates user for testing
			_id: '57105e8b238f3501650879f4',
			currencies: []
		}, cb);
	}
], function(err, user) {
	console.log('user for testing has beend created _id: ' + user._id);
});
