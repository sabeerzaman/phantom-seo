define([ 'backbone', 'models/blogpost', 'views/blogpost' ], function( Backbone, Post, PostView ) {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'!main': 'main'
		},

		index: function() {
			this.navigate( '!main', { trigger: true, replace: true } );
		},

		main: function() {
			var post = new Post({
				timestamp: new Date(),
				title: 'My First Post!',
				body: 'This is my very first post!',
				author: 'Sabeer Zaman'
			});

			var view = new PostView({ model: post });
			view.render().$el.appendTo( '.container' );
		},

		start: function() {
			Backbone.history.start({ pushState: false });
		}
	});
	return Router;
});