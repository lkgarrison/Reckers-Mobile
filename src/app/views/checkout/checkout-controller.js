angular.module('app').controller('checkoutController', ['$scope', '$state', '$mdDialog', 'CartService', function ($scope, $state, $mdDialog, CartService) {
	$scope.cart = CartService.getCart();
	$scope.total = CartService.getTotal();

	$scope.commafyIngredients = function(ingredients) {
		if (ingredients !== undefined) {
			var ingredientsList = '';
			for (var i = 0; i < ingredients.length; i++) {
				ingredientsList+= ingredients[i];
				if (i != ingredients.length - 1) ingredientsList += ", ";
			}

			return ingredientsList;
		}
	};

	$scope.remove = function(item) {
		CartService.removeItem(item);
	};

	$scope.confirmCancel = function () {
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
		$scope.cart = CartService.getCart();
		$scope.total = CartService.getTotal();
	});

	// save months and years for credit card expiration dates
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];

	$scope.years = [];
	var currentYear = new Date().getFullYear();
	var nYears = 10;
	for(var i = 0; i < nYears; i++) {
		$scope.years.push(currentYear + i);
	}
}]);