// Based on phantom-server.js from: 
//	http://backbonetutorials.com/seo-for-single-page-apps/

var JS_LATENCY_TIME_LIMIT = 300,
	TOTAL_TIME_LIMIT = 60000;

var page = require('webpage').create(),
	system = require('system'),
	lastReceived = new Date().getTime(),
	beforeLastReceived = lastReceived,
	requestCount = 0,
	responseCount = 0,
	requestIds = [],
	startTime = new Date().getTime(),
	DEBUG_MODE = system.args[2] === '-debug';

page.onResourceReceived = function(response) {
	if ( DEBUG_MODE )
		console.log( 'REC: ' + response.url );
	if (requestIds.indexOf(response.id) !== -1) {
		if ( DEBUG_MODE ) {
			beforeLastReceived = lastReceived;
			lastReceived = new Date().getTime();
			var duration = lastReceived - beforeLastReceived;
			console.log( 'Since last request: ' + duration + ' ms' );
		}
		responseCount++;
		requestIds[requestIds.indexOf(response.id)] = null;
	}
};

page.onResourceRequested = function(request) {
	if ( DEBUG_MODE )
		console.log( 'REQ: ' + request.url );
	if (requestIds.indexOf(request.id) === -1) {
		requestIds.push(request.id);
		requestCount++;
	}
};

// Open the page 
page.open(system.args[1], function() {});
var checkComplete = function() {
	// We don't allow it to take longer than 5 seconds but 
	// don't return until all requests are finished 
	if ((new Date().getTime() - lastReceived > JS_LATENCY_TIME_LIMIT && requestCount === responseCount) || new Date().getTime() - startTime > TOTAL_TIME_LIMIT) {
		clearInterval(checkCompleteInterval);
		console.log(page.content);
		if ( DEBUG_MODE ) {
			var duration = new Date().getTime() - startTime;
			page.render( 'ss-' + startTime + '.png' );
			console.log( 'Snapshot saved in: ss-' + startTime + '.png' );
			console.log( 'TOTAL TIME: ' + duration + ' ms' );
		}
		phantom.exit();
	}
};
// Let us check to see if the page is finished rendering 
var checkCompleteInterval = setInterval(checkComplete, 1);