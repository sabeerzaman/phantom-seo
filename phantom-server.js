// From: http://backbonetutorials.com/seo-for-single-page-apps/

var JS_LATENCY_TIME_LIMIT = 300,
	TOTAL_TIME_LIMIT = 30000;

var page = require('webpage').create();
var system = require('system');
var lastReceived = new Date().getTime();
var beforeLastReceived = lastReceived;
var requestCount = 0;
var responseCount = 0;
var requestIds = [];
var startTime = new Date().getTime();

page.onResourceReceived = function(response) {
	// console.log( 'REC: ' + response.url );
	if (requestIds.indexOf(response.id) !== -1) {
		// beforeLastReceived = lastReceived;
		lastReceived = new Date().getTime();
		// var duration = lastReceived - beforeLastReceived;
		// console.log( 'Since last request: ' + duration + ' ms' );
		responseCount++;
		requestIds[requestIds.indexOf(response.id)] = null;
	}
};
page.onResourceRequested = function(request) {
	// console.log( 'REQ: ' + request.url );
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
		var duration = new Date().getTime() - startTime;
		console.log(page.content);
		// console.log( 'TOTAL TIME: ' + duration + ' ms' );
		phantom.exit();
	}
}
// Let us check to see if the page is finished rendering 
var checkCompleteInterval = setInterval(checkComplete, 1);