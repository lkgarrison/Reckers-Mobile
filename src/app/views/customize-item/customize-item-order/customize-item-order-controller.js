app.controller('customizeItemOrderController', ['$scope', '$timeout', '$state', '$stateParams', 'MenuService', 'CartService', function ($scope, $timeout, $state, $stateParams, MenuService, CartService) {
	var vm = this;

	var addButtonClicked = false;

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

	vm.shouldDisplayItemOptionsMessage = function () {
		if (vm.option) {
			return false;
		} else if (addButtonClicked) {
			return true;
		} else if (!addButtonClicked) {
			return false;
		}
	};

	vm.addItem = function () {
		addButtonClicked = true;

		if (!validateItem()) {
			return false;
		}

		$state.go('root.order');
		tempItem.ingredients = selectedIngredients;
		tempItem.specialInstructions = vm.specialInstructions;
		tempItem.option = vm.option;
		CartService.addItem(tempItem);

		return true;
	};

	function validateItem() {
		if (vm.item.options !== undefined && vm.option === undefined) {
			return false;
		}

		return true;
	}
}]);
