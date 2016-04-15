// Instantiate dependencies
var express = require('express'),
	fs = require('fs'),
	logger = require('morgan'),
	compression = require('compression'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	mongoose = require('mongoose'),
	session = require('express-session'),
	errorHandler = require('errorhandler'),
	responseTime = require('response-time'),
	api = require('restize');


var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))[process.env.APP_ENV || 'local'];

mongoose.connect(config.mongodb.url);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB error: %s', err);
});

// Express configuration
var app = express();

api.init(app);
app.set('env', 'dev');
console.log(app.get('env'));

app.set('port', 8010);

app.set('trust proxy', true);

app.set('json spaces', 0);
app.set('case sensitive routing', true);
app.set('strict routing', false);
app.set('x-powered-by', false);
app.set('subdomain offset', 3);
// app.disable('etag');

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			msg: err.message,
			error: err
		});
	});
}

// Middlewares
app.use(compression({
	threshold: 1
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cookieParser(config.cookie.parser));
app.use(session({
	key: config.cookie.key,
	secret: config.cookie.parser,
	saveUninitialized: true,
	resave: true,
	rolling: false
}));

//Allow api cross domain
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", req.headers['access-control-request-headers']);
	res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
	// intercept OPTIONS method
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

app.use(errorHandler());
app.use(responseTime());
//app.use(favicon('./public/favicon.ico'));

app.use(logger('tiny'));

// routes
//app.use('/app', express.static('./frontend'));
require('./routes').init(app, api);

// Populate DB with sample data
if (config.mongodb.seed)
	require('./seed');


//
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});

require('./jobs');
module.exports = app;
