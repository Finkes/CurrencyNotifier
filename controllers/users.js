var base = require('../models');
var async = require('async');
var Forex = require('../libs/forex');

var Controller = function() {
	this.config = {
		model: base.User,
		fields: 'currencies',
		no_auth: { //no authenticaion for this app.
			create: true,
			update: true,
			delete: true,
			list: true
		}
	};
};

var checkForCurrencies = function(req, res, next) {
	async.waterfall([

		function(cb) {
			base.Currency.findOne({
				codestring: req.body.codestring
			}).exec(cb);
		},
		function(currency, cb) {
			//Check if currency exist on Forex's API If so, add it to currencies
			if (!currency) {
				Forex.getPrice('EUR', req.body.codestring, function(err, price) {
					if (!err) {
						base.Currency.create({
							codestring: req.body.codestring,
							quote: price.prices[0].bid
						}, cb);
					} else {
						cb({
							error: err.message
						});
					}
				});
			} else {
				cb(null, currency);
			}
		}
	], function(err, currency) {
		if (err) return res.status(400).send(err);
		req.body.currency_id = currency._id;
		next();
	});
};

Controller.prototype.addCurrency = [checkForCurrencies,
	function(req, res) {

		base.User.findOneAndUpdate({
			_id: req.params.user
		}, {
			$addToSet: {
				currencies: req.body.currency_id
			}
		}, {
			new: true
		}).populate([{
			path: 'currencies'
		}]).exec(function(err, user) {
			if (!user) return res.status(404).send({
				error: 'User not found'
			});
			if (err) return res.status(400).send(err);
			res.send(user.currencies); //returns updated user's currencies
		});
	}
];

Controller.prototype.listCurrencies = function(req, res) {
	base.User.findOne({
		_id: req.params.user
	}, {
		currencies: 1
	}).populate([{
		path: 'currencies'
	}]).exec(function(err, user) {
		if (err) return res.status(400).send(err);
		if (!user) return res.status(404).send({
			error: 'User not found'
		});
		res.send(user.currencies); //returns updated user's currencies
	});
};

Controller.prototype.deleteCurrency = [checkForCurrencies,
	function(req, res) {
		base.User.findOneAndUpdate({
			_id: req.params.user
		}, {
			$pull: {
				currencies: req.body.currency_id
			}
		}, {
			new: true
		}).populate([{
			path: 'currencies'
		}]).exec(function(err, user) {
			if (err) return res.status(400).send(err);
			if (!user) return res.status(404).send({
				error: 'User not found'
			});
			res.send(user.currencies); //returns updated user's currencies
		});
	}
];

module.exports = new Controller();
