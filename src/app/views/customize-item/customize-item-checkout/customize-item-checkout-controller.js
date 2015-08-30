app.controller('customizeItemCheckoutController', ['$scope', '$state', '$stateParams', 'CartService', function ($scope, $state, $stateParams, CartService) {
	var vm = this;

	var addButtonClicked = false;

	var cartIndex = $stateParams.cartIndex;
	var tempItem;
	
	var cart = CartService.getCart();
	vm.item = cart[cartIndex];
	var selectedIngredients = _.clone(vm.item.ingredients, true);
	
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

		$state.go('root.checkout');
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
