angular.module('app').controller("orderController", ['$scope', '$timeout', '$location', 'MenuService', function ($scope, $timeout, $location, MenuService) {
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