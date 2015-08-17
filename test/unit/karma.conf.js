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
			'src/app/**/*.js',
			'test/unit/**/*.js'
		],

		exclude: [],

		preprocessors: {},

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher',
		],

		reporters: ['progress'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		// enable/disable watching file and executing tests whenever any file changes
		autoWatch: true,

		browsers: ['PhantomJS'],

		singleRun: true
	});
};