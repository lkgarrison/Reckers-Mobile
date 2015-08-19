app.controller('customizeItemOrderController', ['$scope', '$timeout', '$state', '$stateParams', 'MenuService', 'CartService', function ($scope, $timeout, $state, $stateParams, MenuService, CartService) {
	var vm = this;

	var menuIndex = $stateParams.menuIndex;
	var tempItem;
	var selectedIngredients = [];
	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			// pull data from menu service
			vm.menu = menuData;
			vm.item = menuData[menuIndex];
			vm.ingredients = menuData[menuIndex].ingredients;
			var options = menuData[menuIndex].options;
			vm.options = _.pairs(options);

			// create a copy of the ingredients and the entire item
			selectedIngredients = _.clone(menuData[menuIndex].ingredients, true);
			tempItem = _.clone(menuData[menuIndex], true);
			$scope.$apply();
		});
	});

	vm.toggleIngredient = function (ingredient) {
		var index = selectedIngredients.indexOf(ingredient);
		if (index > -1) selectedIngredients.splice(index, 1);
		else selectedIngredients.push(ingredient);
	};

	vm.isSelectedIngredient = function (item) {
		return selectedIngredients.indexOf(item) > -1;
	};

	vm.addItem = function () {
		if (!validateItem()) {
			return;
		}

		$state.go('root.order');
		tempItem.ingredients = selectedIngredients;
		tempItem.specialInstructions = vm.specialInstructions;
		tempItem.option = vm.option;
		CartService.addItem(tempItem);
	};

	function validateItem() {
		if (vm.item.options !== undefined) {
			if (vm.option === undefined) {
				return false;
			}
		}

		return true;
	}
}]);
