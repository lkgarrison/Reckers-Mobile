app.controller('customizeItemOrderController', ['$scope', '$timeout', '$state', '$stateParams', 'MenuService', 'CartService', function ($scope, $timeout, $state, $stateParams, MenuService, CartService) {
	var menuIndex = $stateParams.menuIndex;
	var tempItem;
	var selectedIngredients = [];
	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			$scope.menu = menuData;
			$scope.item = menuData[menuIndex];
			$scope.ingredients = menuData[menuIndex].ingredients;
			selectedIngredients = _.clone(menuData[menuIndex].ingredients, true);
			tempItem = _.clone(menuData[menuIndex], true);
			$scope.$apply();
		});
	});

	$scope.toggle = function (item) {
		var index = selectedIngredients.indexOf(item);
		if (index > -1) selectedIngredients.splice(index, 1);
		else selectedIngredients.push(item);
	};

	$scope.isSelectedIngredient = function (item) {
		return selectedIngredients.indexOf(item) > -1;
	};

	$scope.addItem = function () {
		tempItem.ingredients = selectedIngredients;
		CartService.addItem(tempItem);
	};

}]);