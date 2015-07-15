var app = angular.module('app', ['MenuService', 'EventBus', 'ngRoute']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'pages/order.html',
				controller: 'orderController'
			})

			.when('/checkout', {
				templateUrl: 'pages/checkout.html',
				controller: 'checkoutController'
			})

			.otherwise({
				redirectTo: '/'
			});
	  }]);

app.controller('headerFooterController', ['$scope', '$route', function ($scope, $route) {
	var checkForPageError = function () {
		currentPages = _.difference([$scope.isOrderPage, $scope.isCheckoutPage, $scope.isPickupPage], [false]);
		if (currentPages.length > 1) {
			console.error('Only one page may be active at a time. Check the $route names');
		}
	};

	var loadedTemplateUrl;
	$scope.$on('$routeChangeSuccess', function () {
		// this listener will be destroyed automatically when the scope is destroyed

		if (_.has($route.current, 'loadedTemplateUrl')) {
			loadedTemplateUrl = $route.current.loadedTemplateUrl;

			// determine current page
			$scope.isOrderPage = loadedTemplateUrl.indexOf('order') !== -1;
			$scope.isCheckoutPage = loadedTemplateUrl.indexOf('checkout') !== -1;
			$scope.isPickupPage = loadedTemplateUrl.indexOf('pickup') !== -1;

			// ensure route url is such that only one page is active at a time
			checkForPageError();
		}
	});
}]);

app.controller("orderController", ['$scope', '$timeout', '$location', 'MenuService', function ($scope, $timeout, $location, MenuService) {
	// add data for collapsible set for menu on order page
	var collapsibleSectionLabels = ['Pizzas', 'Piadinas', 'American Fare', 'Salads', 'Breakfast', 'Sides', 'Smoothies'];
	var menuTypes = MenuService.getMenuTypes();
	$timeout(function () {
		$scope.collapsibleSectionData = collapsibleSectionLabels.map(function (value, index) {
			return {
				label: value,
				type: menuTypes[index]
			};
		});
	});

	$scope.$on('customizeItem-order', function () {
		$location.path('checkout');
	});
}]);

app.controller('checkoutController', ['$scope', function ($scope) {
	// save months and years for credit card expiration dates
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];
	
	$scope.years = [];
	var currentYear = new Date().getFullYear();
	var nYears = 10;
	for(var i = 0; i < nYears; i++) {
		$scope.years.push(currentYear + i);
	}
}]);