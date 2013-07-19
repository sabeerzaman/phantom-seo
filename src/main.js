require.config({
	paths: {
		'underscore': [
			'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min',
			'../vendor/underscore/underscore-1.4.4'
			],
		'backbone': [
			'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
			'../vendor/backbone/backbone-1.0.0'
			],
		'text': '../vendor/require/text-2.0.7',
		'jquery': [
			'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
			'//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min',
			'../vendor/jquery/jquery-1.9.1'
			]
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});