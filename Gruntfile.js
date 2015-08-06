/*jslint node: true */
"use strict";

module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

	var PORT = 8888;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower: {
			install: {
				options: {
					install: true,
					copy: false,
					targetDir: './src/assets/lib',
					cleanTargetDir: true
				}
			}
		},

		concat: {
			options: {
				separator: ';\n'
			},
			appjs: {
				src: ['src/app/**/*.js'],
				dest: 'dist/app.js'
			},
			templatejs: {
				src: ['.tmp/templates.js', 'dist/app.js'],
				dest: 'dist/app.js'
			},
			css: {
				src: ['src/app/**/*.css'],
				// dest: '.tmp/styles.css'
				dest: 'dist/styles.css'
			}
		},

		uglify: {
			dist: {
				files: {
					'dist/app.js': [ 'dist/app.js' ]
				},
				options: {
					mangle: false
				}
			}
		},

		cssmin: {
			minify: {
				src: '.tmp/*.css',
				dest: 'dist/styles.min.css'
			}
		},

		html2js: {
			app: {
				src: [ 'src/app/**/*.html' ],
				dest: '.tmp/templates.js'
			},

		},

		useminPrepare: {
			html: 'src/index.html',
			options: {
				dest: '.tmp/'
			}
		},

		// usemin: {
		// 	// js: 'dist/*.js',
		// 	// css: 'styles/*.css'
		// },

		copy: {
			img: {
				expand: true,
				cwd: 'src/assets',
				src: 'img/*',
				dest: 'dist/assets'
			},
			lib: {
				files: [
					{src: '.tmp/concat/libs.js', dest: 'dist/assets/libs.js'},
					{src: '.tmp/concat/libs.css', dest: 'dist/assets/libs.css'},
				],
			}
		},

		clean: {
			tmp: {
				src: ['.tmp']
			},
			dist: {
				src: ['dist/*','!dist/index.html']
			}
		},

		jshint: {
			all: [ 'Gruntfile.js', 'src/app/**/*.js' ]
		},

		open: {
			all: {
				path: 'http://localhost:' + PORT
			}
		},

		express: {
			all: {
				options: {
					bases: ['src'],
					port: PORT,
					hostname: "localhost",
					livereload: true
				}
			}
		},

		watch: {
			dev: {
				files: ['src/**/*'],
				options: { 
					atBegin: true,
					livereload: 35729
				},
				tasks: ['jshint']
			},
			dev2: {
				files: [ 'Gruntfile.js', 'app/*.js', '*.html' ],
				tasks: [ 'jshint', 'karma:unit', 'ngtemplates:app', 'concat:appjs', 'clean:temp' ],
				options: {
					atBegin: true
				}
			},
			min: {
				files: [ 'Gruntfile.js', 'app/*.js', '*.html' ],
				tasks: [ 'jshint', 'karma:unit', 'ngtemplates:app', 'concat:appjs', 'clean:temp', 'uglify:dist' ],
				options: {
					atBegin: true
				}
			}
		},

		karma: {
			options: {
				configFile: 'config/karma.conf.js'
			},
			unit: {
				singleRun: true
			},
			
			continuous: {
				singleRun: false,
				autoWatch: true
			}
		}
	});

	grunt.registerTask('dev', ['express', 'open', 'watch:dev']);
	grunt.registerTask('test', [ 'bower', 'jshint', 'karma:continuous' ]);
	grunt.registerTask('minified', [ 'bower', 'connect:server', 'watch:min' ]);
	grunt.registerTask('package', [ 'bower', 'jshint', 'karma:unit', 'ngtemplates:app', 'concat:appjs', 'uglify:dist',
		'clean:tmp' ]);
	grunt.registerTask('build', 
		[
			'jshint',
			/*'karma:unit',*/
			'clean',
			'useminPrepare',
			'concat:generated',
			// 'usemin',
			'concat:appjs',
			'uglify:dist',
			'concat:css',
			// 'cssmin',
			'html2js',
			'concat:templatejs',
			'copy'
		]
	);
};