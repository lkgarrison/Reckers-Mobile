module.exports = function (config) {
	config.set({
		// base path that will be used to resolve all patterns
		basePath: '../../',

		frameworks: ['jasmine'],

		files: [
			'src/assets/lib/angular/angular.js',
			'src/assets/lib/angular-mocks/angular-mocks.js',
			'src/assets/lib/angular-animate/angular-animate.min.js',
			'src/assets/lib/angular-aria/angular-aria.min.js',
			'src/assets/lib/angular-ui-router/release/angular-ui-router.js',
			'src/assets/lib/angular-material/angular-material.js',
			'src/assets/lib/lodash/lodash.min.js',
			'src/app/**/*.js',
			'src/app/**/*.html',
			'test/unit/**/*.js'
		],

		exclude: [],

		preprocessors: {
			'src/app/**/*.html': ['ng-html2js'],
			'src/app/**/*.js': ['coverage']
		},

		ngHtml2JsPreprocessor: {
			// strip this from the file path
			stripPrefix: 'src/',
			// create a single module that contains templates from all the files
			moduleName: 'templates'
		},

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher',
			'karma-ng-html2js-preprocessor',
			'karma-coverage'
		],

		reporters: ['progress', 'coverage'],

		// optionally, configure the reporter
		coverageReporter: {
			reporters: [{ type: 'html', subdir: 'coverage' }],
			dir : 'dist/reports/'
		},

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		// enable/disable watching file and executing tests whenever any file changes
		autoWatch: true,

		browsers: ['PhantomJS'],

		singleRun: true
	});
};