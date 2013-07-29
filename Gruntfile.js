module.exports = function( grunt ) {
	grunt.initConfig({
		jasmine: {
			client: {
				src: 'src/**/*.js',
				options: {
					specs: 'specs/**/*.spec.js',
					junit: {
						path: './',
						consolidate: true
					}
				}
			}
		},

		jshint: {
			files: {
				src: ['./**/*.js'],
				filter: function( filepath ) {
					var isThirdParty = filepath.match( /node_modules[\/\\]/g ) ||
						filepath.match( /vendor[\/\\]/g ),
						isConfig = filepath.match( /.*(?:karma.conf.js)$/g );

					if ( !isThirdParty && !isConfig )
						console.log( 'Linting ' + filepath + '...' );

					return !isThirdParty && !isConfig;
				}
			},
			options: {
				bitwise: true,
				curly: false,
				eqeqeq: true,
				expr: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				regexp: true,
				undef: true,
				strict: false,
				trailing: true,
				node: true,
				globals: {
					define: true,
					describe: true,
					beforeEach: true,
					afterEach: true,
					it: true,
					expect: true,
					runs: true,
					waits: true,
					waitsFor: true,
					window: true,
					document: true,
					jasmine: true,
					sinon: true,
					$: true,
					_: true
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jasmine' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );

	grunt.registerTask( 'test', [ 'jasmine' ] );
	grunt.registerTask( 'default', [ 'jshint', 'test' ] );
};