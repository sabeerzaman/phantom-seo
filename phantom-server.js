// From: http://backbonetutorials.com/seo-for-single-page-apps/

var page = require('webpage').create();
var system = require('system');
var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var requestIds = [];
var startTime = new Date().getTime();

page.onResourceReceived = function(response) {
	if (requestIds.indexOf(response.id) !== -1) {
		lastReceived = new Date().getTime();
		responseCount++;
		requestIds[requestIds.indexOf(response.id)] = null;
	}
};
page.onResourceRequested = function(request) {
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
	if ((new Date().getTime() - lastReceived > 300 && requestCount === responseCount) || new Date().getTime() - startTime > 5000) {
		clearInterval(checkCompleteInterval);
		page.render( 'ss.png' );
		console.log(page.content);
		phantom.exit();
	}
}
// Let us check to see if the page is finished rendering 
var checkCompleteInterval = setInterval(checkComplete, 1);