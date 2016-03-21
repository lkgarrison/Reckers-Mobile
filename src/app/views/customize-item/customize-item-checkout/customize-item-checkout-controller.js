app.controller('customizeItemCheckoutController', ['$scope', '$state', '$stateParams', 'CartService', function ($scope, $state, $stateParams, CartService) {
	var vm = this;

	var saveButtonClicked = false;

	var cartIndex = $stateParams.cartIndex;
	
	var cart = CartService.getCart();
	vm.item = cart[cartIndex];

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
		} else if (saveButtonClicked) {
			return true;
		} else if (!saveButtonClicked) {
			return false;
		}
	};

	vm.saveItem = function () {
		saveButtonClicked = true;

		if (!CartService.saveItem(vm.item, cartIndex)) {
			return false;
		}

		$state.go('root.checkout');

		return true;
	};
}]);
