var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))[process.env.APP_ENV || 'local'];
var Agenda = require('agenda');
var agenda = new Agenda();
var async = require('async');
var base = require('../models');
var Forex = require('../libs/forex');

agenda.database(config.mongodb.url, 'agendaJobs').processEvery('30 seconds');

//Utils
agenda.define('updateCurrencies', function(job, done) {
	console.log('updating currencies ...');
	async.waterfall([

		function(cb) { // gets all currencies
			base.Currencies.find({}).exec(cb);
		},
		function(currencies, cb) {
			async.each(currencies, function(currency, cb) {
				Forex.getPrice('EUR', currency.codestring, function(err, price) {
					if (currency.quote < price.prices[0].bid) { // If value is higher, send a push to user interested in this currency
						base.User.find({
							currencies: currency._id
						}).exec(function(err, users) { //send push to this users
							async.each(users, function(user, cb) {
								user.sendPush({
									codestring: currency.codestring
								}, cb);
							}, function(err) {});
						});
					}
					base.Currency.findOneAndUpdate({
						_id: currency._id
					}, {
						$set: {
							quote: price.prices[0].bid
						}
					}).exec(cb);
				});
			}, cb);
		}
	], done);
	done();
});

agenda.every('1 hour', 'updateCurrencies');

agenda.start();

console.log('[AGENDA IS RUNNING]');
