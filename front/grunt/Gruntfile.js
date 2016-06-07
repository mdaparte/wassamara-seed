module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			task: {
				src: ['../app/src/**/*.js'],
				dest: '../app/min/code.js'
			},
			options: {
				'mangle': {},
				'compress': {},
				'beautify': false,
				'expression': false,
				'report': 'min',
				'sourceMap': false,
				'sourceMapName': undefined,
				'sourceMapIn': undefined,
				'sourceMapIncludeSources': false,
				'enclose': undefined,
				'wrap': undefined,
				'exportAll': false,
				'preserveComments': undefined,
				'banner': '',
				'footer': ''
			}
		},
		jshint: {
			task: {
				src: ['../app/src/**/*.js'],
				dest: 'destination'
			},
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			}
		},
		watch: {
			configFiles: {
				files: [ 'Gruntfile.js', 'config/*.js' ],
				options: {
					reload: true
				}
			},
			scripts: {
				files: [ '..\\app\\src\\**\\*.js'],
				tasks: ['uglify', 'jshint'],
				options: {
					spawn: false,
					debounceDelay: 250

				}
			}
		}


	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify', 'jshint']);
};
