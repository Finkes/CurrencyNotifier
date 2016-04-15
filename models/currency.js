var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Currency
var CurrencySchema = new Schema({
	codestring: {
		type: String
	},
	quote: {
		type: Number,
		default: 0
	}
}, {
	collection: 'currencies'
});

module.exports = mongoose.model('Currency', CurrencySchema);
