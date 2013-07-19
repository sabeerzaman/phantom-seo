define( [ 'backbone' ], function( Backbone ) {
	var Post = Backbone.Model.extend({
		defaults: {
			timestamp: null,
			title: '',
			body: '',
			author: '',
			comments: []
		}
	});
	return Post;
});