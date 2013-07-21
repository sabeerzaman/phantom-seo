var page = require( 'webpage' ).create(),
	system = require( 'system' );

var url = system.args[1] || 'http://dstore:Desire2LearnStore@solutionshowcase.desire2learn.com';
console.log( 'URL = ' + url );

page.open( url, function() {
	page.render( 'ss.png' );
	console.log( JSON.stringify( page, undefined, 2 ) );
	phantom.exit();
});