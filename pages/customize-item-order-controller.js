app.controller('customizeItemOrderController', ['$scope', '$timeout', '$stateParams', 'MenuService', function ($scope, $timeout, $stateParams, MenuService) {
	var menuIndex = $stateParams.menuIndex;

	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			$scope.menu = menuData;
			$scope.item = menuData[menuIndex];
			$scope.ingredients = menuData[menuIndex].ingredients;
			$scope.$apply();
		});
	});

	$scope.selected = [];
	$scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	};

	$scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	};

	$scope.addItem = function () {

	};

}]);