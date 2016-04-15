var Pusher = require('pusher');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))[process.env.APP_ENV || 'local'];

var pusher = new Pusher({
	appId: config.pusher.app_id,
	key: config.pusher.key,
	secret: config.pusher.secret,
	encrypted: true
});

module.exports = pusher;
