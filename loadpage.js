var page = require( 'webpage' ).create();
page.open( 'http://dstore:Desire2LearnStore@solutionshowcase.desire2learn.com', function() {
	page.render( 'ss.png' );
	console.log( JSON.stringify( page, undefined, 2 ) );
	phantom.exit();
});