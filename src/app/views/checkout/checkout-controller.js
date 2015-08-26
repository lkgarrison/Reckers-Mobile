angular.module('app').controller('checkoutController', ['$scope', '$state', '$mdDialog', 'CartService', function ($scope, $state, $mdDialog, CartService) {
	var vm = this;

	vm.cart = CartService.getCart();
	vm.total = CartService.getTotal();

	vm.getOptionsAndIngredients = function (item) {
		var optionAndIngredients = '';
		var separator = ': ';

		if (item.option !== undefined) {
			optionAndIngredients += item.option;
		}

		if (item.ingredients !== undefined) {
			if (item.option !== undefined) {
				optionAndIngredients += separator;
			}
			optionAndIngredients += commafyIngredients(item.ingredients);
		}

		return optionAndIngredients;
	};

	vm.remove = function (item) {
		CartService.removeItem(item);
	};

	vm.confirmCancel = function () {
		$mdDialog.show(
			$mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Confirm Cancellation')
				.content('Are you sure you would like to cancel your order?')
				.ok('Yes')
				.cancel('No')

		).then(function () {
			// handler for confirming order cancellation
			CartService.emptyCart();
			$state.go('root.order');
		});
	};

	// update the cart for the view
	$scope.$on('cart-updated', function () {
		vm.cart = CartService.getCart();
		vm.total = CartService.getTotal();
	});

	// save months and years for credit card expiration dates
	vm.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];

	vm.years = [];
	var currentYear = new Date().getFullYear();
	var nYears = 10;
	for(var i = 0; i < nYears; i++) {
		vm.years.push(currentYear + i);
	}

	function commafyIngredients(ingredients) {
		if (ingredients !== undefined) {
			var ingredientsList = '';
			for (var i = 0; i < ingredients.length; i++) {
				ingredientsList+= ingredients[i];
				if (i != ingredients.length - 1) ingredientsList += ", ";
			}

			return ingredientsList;
		}
	}
}]);
