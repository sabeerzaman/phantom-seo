var express = require( 'express' ),
	app = express(),
	mongoose = require( 'mongoose' ),
	_ = require( 'underscore' );

mongoose.connect( 'mongodb://localhost/test' );

var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ) );

var dbError = function( err, res ) {
	var errStr = JSON.stringify( err, undefined, 2 );
	console.log( 'DB error!' );
	console.log( errStr );
	if ( res )
		res.status( 500 ).send( err );
};

// SCHEMAS + MODELS
var blogpostSchema = mongoose.Schema({
	title: String,
	author: String,
	created: { type: Date },
	updated: { type: Date, default: Date.now },
	text: String,
	tags: [String]
});

var Blogpost = mongoose.model( 'Blogpost', blogpostSchema );

app.configure(function() {
	app.use( express.bodyParser() );
	app.use( express.methodOverride() ); // Allows use of PUT, DELETE HTTP methods
	app.use( app.router ); // [OPTIONAL] - mounts the routes
});

app.get( '/blogposts', function( req, res ) {
	console.log( 'GET /blogposts' );

	Blogpost.find(function( err, posts ) {
		if ( !err )
			res.send( posts );
		else
			dbError( err, res );
	});
});

app.get( '/blogposts/:id', function( req, res ) {
	console.log( 'GET /blogposts/' + req.params.id );

	Blogpost.findById( req.params.id, function( err, post ) {
		if ( !err ) {
			if ( !post )
				res.status( 404 ).send();
			else
				res.send( post );
		}
		else {
			dbError( err, res );
		}
	});
});

app.post( '/blogposts', function( req, res ) {
	console.log( 'POST /blogposts' );

	var fields = _.keys( _.omit( blogpostSchema.paths, ['_id', '__v', 'created', 'updated'] ) ),
		newData = _.pick( req.body, fields ),
		newPost = new Blogpost( newData );

	newPost.created = Date.now();

	newPost.save(function( err, result ) {
		if ( !err )
			res.send({ id: result.id });
		else
			dbError( err, res );
	});
});

app.put( '/blogposts/:id', function( req, res ) {
	console.log( 'PUT /blogposts' );
	Blogpost.findById( req.params.id, function( err, post ) {
		if ( !post ) {
			res.status( 404 ).send();
			return;
		}

		var fields = _.keys( _.omit( blogpostSchema.paths, ['_id', '__v', 'created'] ) ),
			update = _.pick( req.body, fields );

		_.extend( post, update );
		post.updated = Date.now();

		post.save( function( err ) {
			if ( !err )
				res.status( 204 ).send();
			else
				dbError( err, res );
		});
	});
});

app.delete( '/blogposts/:id', function( req, res ) {
	console.log( 'DELETE /blogposts/' + req.params.id );

	Blogpost.findById( req.params.id, function( err, post ) {
		if ( !post ) {
			res.status( 404 ).send();
			return;
		}

		post.remove( function( err ) {
			if ( !err )
				res.status( 204 ).send();
			else
				dbError( err, res );
		});
	});
});

app.listen( 2000 );
console.log( 'Listening on port 2000' );