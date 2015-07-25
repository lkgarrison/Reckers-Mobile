var app = angular.module('app', ['MenuService', 'CartService', 'EventBus', 'ui.router', 'door3.css', 'ngMaterial']);
app.run(['$state', '$stateParams',
    function($state, $stateParams) {
        //this solves page refresh and getting back to state
}]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/order');

	$stateProvider
		.state('root', {
			url: '',
			templateUrl: 'app-views.html'
		})

		.state('root.order', {
			url: '/order',
			phase: 'order',
			views: {
				"header" : {
					templateUrl: 'headers/order-header.html',
					css: 'headers/order-header.css'
				},
				"content" : {
					templateUrl: 'pages/order.html',
					controller: 'orderController',
				}
			}
			
		})

		.state('root.customize-item-order', {
			url: '/customize-item-order/{menuIndex}',
			phase: 'order',
			views: {
				"header" : {
					templateUrl: 'headers/order-header.html',
					css: 'headers/order-header.css'
				},
				"content" : {
					templateUrl: 'pages/customize-item-order.html',
					controller: 'customizeItemOrderController',
					css: 'pages/customize-item.css'
				}
			}
		});

		// .state('checkout', {
		// 	url: '/checkout',
		// 	templateUrl: 'pages/checkout.html',
		// 	controller: 'checkoutController',
		// 	phase: 'checkout'
		// })

		// .state('customize-item-order', {
		// 	url: '/customize-item-order/{menuIndex}',
		// 	templateUrl: 'pages/customize-item-order.html',
		// 	controller: 'customizeItemOrderController',
		// 	phase: 'order',
		// 	css: 'pages/customize-item.css'
		// });
});

app.controller('headerFooterController', ['$scope', '$state', 'CartService', function ($scope, $state, CartService) {
	var cartWithoutItems = '../img/cartEmpty.png';
	var cartWithItems = '../img/cartWithItems.png';
	var cartQuantitySingleDigitsClass = 'cart-quantity-single-digits';
	var cartQuantityDoubleDigitsClass = 'cart-quantity-double-digits';
	var headerPrefix = 'headers/';
	var headerSuffix = '-header.html';

	// is this initialization necessary?
	$scope.cartQuantityClass = cartQuantitySingleDigitsClass;

	$scope.cartLogo = cartWithoutItems;
	$scope.quantity = 0;

	$scope.$on('item-added', function () {
		$scope.quantity = CartService.getTotalQuantity();
		modifyCartLogo();
	});

	function modifyCartLogo() {
		$scope.cartLogo = $scope.quantity === 0 ? cartWithoutItems : cartWithItems;
		$scope.cartQuantityClass = $scope.quantity < 10 ? cartQuantitySingleDigitsClass : cartQuantityDoubleDigitsClass;
	}

	function checkForPageError() {
		currentPages = _.difference([$scope.isOrderPage, $scope.isCheckoutPage, $scope.isPickupPage], [false]);
		if (currentPages.length > 1) {
			console.error('Only one page may be active at a time. Check the $route names');
		}
	}

	$scope.$on('$stateChangeSuccess', function () {
		// this listener will be destroyed automatically when the scope is destroyed
		var stateName = $state.current.phase;

		// determine current page
		$scope.isOrderPage = stateName === 'order';
		$scope.isCheckoutPage = stateName === 'checkout';
		$scope.isPickupPage = stateName === 'pickup';

		// ensure route url is such that only one page is active at a time
		checkForPageError();

		$scope.headerFile = headerPrefix + stateName + headerSuffix;
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