/**
 * Server - This is the Node.js Server.
 * @object
 */
var fs = require('fs'),
	util = require('util'),
	httpProxy = require('http-proxy');

var colors = require('colors');
colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

/* */
 console.log("this is an silly".silly);
 console.log("this is an input".input);
 console.log("this is an verbose".verbose);
 console.log("this is an prompt".prompt);
 console.log("this is an info".info);
 console.log("this is an data".data);
 console.log("this is an help".help);
 console.log("this is an debug".debug);
 console.log("this is an error".error);
 console.log("this is a warning".warn);


/**
 * @TODO - HTTPS Key and Cert
 *
 * This is the location of your https cert and key.
 */
var httpsKey = fs.readFileSync('./config/apache.key').toString();
var httpsCert = fs.readFileSync('./config/apache.crt').toString();


/**
 * @TODO - Proxy Options
 * This object holds options used for creating a proxy server.
 */
var options = {
	port: null,
	host: {
		hostname: 'localhost',
		port: 8181
	},
	proxy: {
		hostname: 'localhost',
		port: 5001
	},
	api: {
		hostname: 'localhost',
		port: 5151
	},
	key: httpsKey,
	cert: httpsCert,
	hostncmsOnly: true,
	router: {}
};


/**
 * @TODO - Externalize configuration for server and proxy, mongodb
 */
var config = JSON.parse(fs.readFileSync('./config/config.json'));

//Dynamic rest server
var rest = require('./routes/rest').rest;

//Socket server
var socket = require('./routes/socketserver').SocketServer;




//Create proxy server and proxy requests
proxyServer = httpProxy.createServer(options, function (req, res, proxy) {

	console.log('Proxy server started on port: ' + options.host.port);

	// console.log('proxyServer', options);
	if (req.url.match(/^\/api\//)) {
		proxy.proxyRequest(req, res, {
			host: '127.0.0.1',
			port: options.api.port
		});
		console.log('Routing request: API server'.warn);

	} else if (req.url.match(/^\/1\//)) {

		/* Default express server */
		proxy.proxyRequest(req, res, {
			host: 'api.parse.com'
		});
		console.log('Routing request: Parse Server'.warn);

	} else {

		/* Default express server */
		proxy.proxyRequest(req, res, {
			host: '127.0.0.1',
			port: options.api.port
		});
		console.log('Routing request: App Server'.warn);
	}
});

//Initialize socket server and rest server
socket.init(proxyServer);


config.staticDir = __dirname + '/app';
config.publicDir = __dirname + '/.tmp';
//config.publicDir = __dirname + '/www';
rest.init(config);

//Start the proxy server
proxyServer.listen(options.port);


/**
 * Test Email

var email = require("emailjs");
var server = email.server.connect({
	user: config.email.username,
	password: config.email.password,
	host: "smtp.gmail.com",
	ssl: false
});

var message = {
	text: "i hope this works",
	from: "you <angular.cms@gmail.com>",
	to: "jonniespratley <jonniespratley@gmail.com>",
	cc: "angular.cms <angular.cms@gmail.com>",
	subject: "testing angular-cms emailjs",
	attachment: [
		{data: "<html>i <i>hope</i> this works!</html>", alternative: true}
		// {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
	]
};


server.send(message, function(err, message) { console.log(err || message); });
*/
