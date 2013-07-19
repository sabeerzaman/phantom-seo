define( [ 'backbone', 'underscore', 'text!templates/blogpost.html' ], function( Backbone, _, tmpl ) {
	var PostView = Backbone.View.extend({
		render: function() {
			this.$el.html( _.template( tmpl, this.model.attributes ) );
			return this;
		}
	});
	return PostView;
});