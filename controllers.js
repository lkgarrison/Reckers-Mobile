var app = angular.module('app', ['MenuService']);

app.controller("myController", ['$scope', '$timeout', 'MenuService', function ($scope, $timeout, MenuService) {
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
	
	
	// save months and years for credit card expiration dates
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];
	
	$scope.years = [];
	var currentYear = new Date().getFullYear();
	var nYears = 10;
	for(var i = 0; i < nYears; i++) {
		$scope.years.push(currentYear + i);
	}
}]);