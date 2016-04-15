var controllers = require('./controllers');

module.exports.init = function(app, api) {

	api.register('/users', controllers.Users.config); //CRUD for users
	app.put('/users/:user/currencies', controllers.Users.addCurrency);
	app.get('/users/:user/currencies', controllers.Users.listCurrencies);
	app.delete('/users/:user/currencies', controllers.Users.deleteCurrency);

};
