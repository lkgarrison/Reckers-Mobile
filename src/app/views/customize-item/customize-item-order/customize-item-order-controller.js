app.controller('customizeItemOrderController', ['$scope', '$timeout', '$state', '$stateParams', 'MenuService', 'CartService', function ($scope, $timeout, $state, $stateParams, MenuService, CartService) {
	var vm = this;

	var addButtonClicked = false;

	var menuIndex = $stateParams.menuIndex;
	var selectedIngredients = [];
	$timeout(function () {
		MenuService.getMenu().then(function (menuData) {
			// pull data from menu service
			vm.menu = menuData;
			vm.item = menuData[menuIndex];

			// initialize selected ingredients and option
			vm.item.selectedIngredients = _.clone(vm.item.availableIngredients, true);
			vm.item.option = undefined;
		});
	});

	vm.toggleIngredient = function (ingredient) {
		var index = vm.item.selectedIngredients.indexOf(ingredient);
		if (index > -1) vm.item.selectedIngredients.splice(index, 1);
		else vm.item.selectedIngredients.push(ingredient);
	};

	vm.isSelectedIngredient = function (item) {
		return vm.item.selectedIngredients.indexOf(item) > -1;
	};

	vm.shouldDisplayItemOptionsMessage = function () {
		if (vm.item.option) {
			return false;
		} else if (addButtonClicked) {
			return true;
		} else if (!addButtonClicked) {
			return false;
		}
	};

	vm.addItem = function () {
		addButtonClicked = true;

		if (!CartService.addItem(vm.item)) {
			return false;
		}

		$state.go('root.order');

		return true;
	};
}]);
