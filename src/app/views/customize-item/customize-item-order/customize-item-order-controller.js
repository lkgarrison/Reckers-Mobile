app.controller('customizeItemOrderController', ['$scope', '$timeout', '$state', '$stateParams', 'MenuService', 'CartService', function ($scope, $timeout, $state, $stateParams, MenuService, CartService) {
	var menuIndex = $stateParams.menuIndex;
	var tempItem;
	var selectedIngredients = [];
	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			// pull data from menu service
			$scope.menu = menuData;
			$scope.item = menuData[menuIndex];
			$scope.ingredients = menuData[menuIndex].ingredients;
			var options = menuData[menuIndex].options;
			$scope.options = _.pairs(options);

			// create a copy of the ingredients and the entire item
			selectedIngredients = _.clone(menuData[menuIndex].ingredients, true);
			tempItem = _.clone(menuData[menuIndex], true);
			$scope.$apply();
		});
	});

	$scope.toggleIngredient = function (ingredient) {
		var index = selectedIngredients.indexOf(ingredient);
		if (index > -1) selectedIngredients.splice(index, 1);
		else selectedIngredients.push(ingredient);
	};

	$scope.isSelectedIngredient = function (item) {
		return selectedIngredients.indexOf(item) > -1;
	};

	$scope.addItem = function () {
		if (!validateItem()) {
			return;
		}

		$state.go('root.order');
		tempItem.ingredients = selectedIngredients;
		tempItem.specialInstructions = $scope.specialInstructions;
		tempItem.option = $scope.option;
		CartService.addItem(tempItem);
	};

	function validateItem() {
		if ($scope.item.options !== undefined) {
			if ($scope.option === undefined) {
				return false;
			}
		}

		return true;
	}
}]);
