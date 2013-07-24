// Express is our web server that can handle request
var express = require('express');
var app = express();

var getContent = function(url, callback) {
	var content = '';
	// Here we spawn a phantom.js process, the first element of the
	// array is our phantomjs script and the second element is our url
	var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', url]);
	phantom.stdout.setEncoding('utf8');
	// Our phantom.js script is simply logging the output and
	// we access it here through stdout
	phantom.stdout.on('data', function(data) {
		content += data.toString();
	});
	phantom.on('exit', function(code) {
		if (code !== 0) {
			console.log('We have an error');
		} else {
			// once our phantom.js script exits, let's call out call back
			// which outputs the contents to the page
			callback(content);
		}
	});
};

var respond = function(req, res) {
	var path = req.path + '#!' + ( req.query.hashbang ? req.query.hashbang : '' );

	// Because we use [P] in htaccess we have access to this header
	var url = 'http://' + req.headers['x-forwarded-host'] + path;

	console.log( 'URL = ' + url );
	getContent(url, function(content) {
		content = content.replace( /<script.*?<\/script>/gim, '' );
		console.log( 'Received (after removing script tags): ' ); console.log( content );
		res.send(content);
	});
};
app.get(/(.*)/, respond);
app.listen(3000);
console.log( 'Listening on port 3000' );