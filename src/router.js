define([ 'backbone', 'jquery', 'text!templates/home.html', 'text!templates/about.html', 'text!templates/setup.html', 'text!templates/references.html' ], function( Backbone, $, tmplHome, tmplAbout, tmplSetup, tmplReferences ) {
	var Router = Backbone.Router.extend({
		routes: {
			'(!)': 'home',
			'!home': 'home',
			'!about': 'about',
			'!setup': 'setup',
			'!references': 'references'
		},

		tmpl: {
			'home': tmplHome,
			'about': tmplAbout,
			'setup': tmplSetup,
			'references': tmplReferences
		},

		initialize: function() {
			this.on( 'route', this.updateNav );
			this.on( 'route', this.renderPage );
		},

		index: function() {
			this.navigate( '!home', { trigger: true }, { replace: true } );
		},

		updateNav: function( route ) {
			$( 'li.active', '.nav' ).removeClass( 'active' );
			$( 'a[href*="'+route+'"]' ).parent( 'li' ).addClass( 'active' );
		},

		renderPage: function( route ) {
			$( '#content' ).html( this.tmpl[ route ] );
			$( 'body' ).addClass( 'render-complete' );
		},

		start: function() {
			Backbone.history.start({ pushState: false });
		}
	});
	return Router;
});