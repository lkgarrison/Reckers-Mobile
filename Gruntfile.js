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
				options: {
					separator: '\n\n'
				},
				src: ['src/app/**/*.css'],
				dest: 'src/.tmp/styles.css'
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
			},
			coverage: ['src/app/**/index.html', 'src/app/**/*.js.html']
		},

		jshint: {
			all: [ 'Gruntfile.js', 'src/app/**/*.js' ]
		},

		open: {
			dev: {
				path: 'http://localhost:' + PORT
			}
		},

		connect: {
			coverage: {
				options: {
					port: 5555,
					base: {
						path: 'dist/reports/coverage/',
						options: {
							index: 'index.html'
						}
					},
					open: true,
					keepalive: true
				}
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
				files: ['src/app/**/*', 'src/index.html', 'test/unit/**/*.js'],
				options: { 
					atBegin: true,
					livereload: 35729
				},
				tasks: ['concat:css', 'jshint', 'karma:single']
			},
			none: {
				files: ['none'],
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
			debug: {
				options: {
					configFile: 'test/unit/karma.conf.debug.js'
				},
				singleRun: false,
				autoWatch: true
			},
			single: {
				options: {
					configFile: 'test/unit/karma.conf.js'
				},
				singleRun: true
			},
			continuous: {
				options: {
					configFile: 'test/unit/karma.conf.js'
				},
				singleRun: false,
				autoWatch: true
			},
			coverage: {
				options: {
					configFile: 'test/unit/karma.conf.coverage.js'
				},
				singleRun: true
			},
		}
	});

	grunt.registerTask('coverage-refresh', ['karma:coverage', 'clean:coverage']);
	grunt.registerTask('coverage', ['karma:coverage', 'clean:coverage', 'connect:coverage']);
	grunt.registerTask('watch-none', ['concat:css', 'express', 'open:dev', 'watch:none']);
	grunt.registerTask('dev', ['concat:css', 'express', 'open:dev', 'watch:dev']);
	grunt.registerTask('test', ['jshint', 'karma:continuous']);
	grunt.registerTask('unit', ['jshint', 'karma:continuous']);
	grunt.registerTask('debug', ['jshint', 'karma:debug']);
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