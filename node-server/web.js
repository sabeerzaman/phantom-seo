// Express is our web server that can handle request
var PORT = 3000,
	express = require('express'),
	app = express(),
	fs = require( 'fs' ),
	htmlLocation = 'html_snapshots';

var getContent = function(url, callback) {
	var content = '';
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
		}
		else {
			callback(content);
		}
	});
};

var createFilePath = function( fragment ) {
	return htmlLocation + '/' + ( fragment || 'index' ) + '.html';
};

var saveToFile = function( fragment, content ) {
	var path = createFilePath( fragment ),
		pathParts = path.split( /[\\\/]/g ),
		filename = encodeURIComponent( pathParts.pop() ).replace( /[^\w.]/g, '-' ),
		dirPath = pathParts.join( '/' ),
		htmlFile;

	if ( !fs.existsSync( dirPath ) ) {
		var dir = '';
		for ( var i = 0; i < pathParts.length; i++ ) {
			dir += pathParts[i] + '/';
			if ( dir && !fs.existsSync( dir ) ) {
				fs.mkdirSync( dir );
			}
		}
	}

	htmlFile = fs.createWriteStream( dirPath + '/' + filename );
	htmlFile.on( 'error', function( err ) {
		console.log( 'There was an error writing to the file: ' );
		console.log( err );
	});
	htmlFile.end( content );
};

var fileExists = function( fragment ) {
	return fs.existsSync( createFilePath( fragment ) );
};

var respond = function(req, res) {
	var fragment = decodeURIComponent( req.query.hashbang ? req.query.hashbang : '' ),
		path = req.path + '#!' + fragment,
		forceRender = req.query.rerender && req.query.rerender !== 'false';
	// Because we use [P] in htaccess we have access to this header
	var url = 'http://' + req.headers['x-forwarded-host'] + path;

	console.log( 'URL = ' + url );

	if ( !forceRender && fileExists( fragment ) ) {
		console.log( 'File already pre-rendered - sending it now' );
		fs.readFile( createFilePath( fragment ), { encoding: 'utf8' },
			function( err, data ) {
				if ( err ) {
					var errStr = '<pre>' + JSON.stringify( err, undefined, 2 ) + '</pre>';
					console.log( 'Error reading file: ' );
					console.log( errStr );

					res.writeHead( 500, {
						'Content-Length': errStr.length,
						'Content-Type': 'text/html'
					});
					res.end( errStr );
				}
				else {
					console.log( 'File contents: ' );
					console.log( data );
					res.writeHead( 200, {
						'Content-Length': data.length,
						'Content-Type': 'text/html'
					});
					res.end( data );
				}
			}
		);
	}
	else {
		getContent(url, function(content) {
			content = content.replace( /<script.*?<\/script>/gim, '' );

			console.log( 'Received (after removing script tags): ' );
			console.log( content );

			saveToFile( fragment, content );
			res.send(content);
		});
	}
};
app.get(/(.*)/, respond);
app.listen(PORT);
console.log( 'Listening on port 3000' );