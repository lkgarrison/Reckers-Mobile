angular.module('app').controller("orderController", ['$timeout', '$location', 'MenuService', function ($timeout, $location, MenuService) {
	var vm = this;

	// add data for collapsible set for menu on order page
	var collapsibleSectionLabels = ['Pizzas', 'Piadinas', 'American Fare', 'Salads', 'Breakfast', 'Sides', 'Smoothies'];
	var menuTypes = MenuService.getMenuTypes();
	$timeout(function () {
		vm.collapsibleSectionData = collapsibleSectionLabels.map(function (value, index) {
			return {
				label: value,
				type: menuTypes[index]
			};
		});
	});
}]);