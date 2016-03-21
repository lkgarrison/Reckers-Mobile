angular.module('app').controller('collapsibleSectionController', ['$scope', '$timeout', 'MenuService', 'EventService', function ($scope, $timeout, MenuService, EventService) {
	/* make Menu service data accessible to directive's html
	 * use $timeout to ensure $digest cycle is complete and $scope is applied
	 */
	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			$scope.menu = menuData;
			$scope.$apply();
		});
	});

	$scope.menuTypes = MenuService.getMenuTypes();
}]);