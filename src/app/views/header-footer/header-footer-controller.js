angular.module('app').controller('headerFooterController', ['$scope', '$state', '$mdDialog', 'CartService', function ($scope, $state, $mdDialog, CartService) {
	$scope.quantity = 0;

	// broadcast so that order-view can pick up the broadcast and display the popup
	$scope.attemptToGoToCheckout = function () {
		if ($scope.quantity === 0) {
			displayNoItemsInCartError();
		} else {
			$state.go('root.checkout');
		}
	};

	// update quantity displayed inside cart logo
	$scope.$on('cart-updated', function () {
		$scope.quantity = CartService.getTotalQuantity();
	});

	function displayNoItemsInCartError() {
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('Empty Cart')
				.content('Add items to your cart first!')
				.ok('Okay!')
		);
	}

	function checkForPageError() {
		currentPages = _.difference([$scope.isOrderPage, $scope.isCheckoutPage, $scope.isPickupPage], [false]);
		if (currentPages.length > 1) {
			console.error('Only one page may be active at a time. Check the $route names');
		}
	}

	$scope.$on('$stateChangeSuccess', function () {
		// this listener will be destroyed automatically when the scope is destroyed
		var stateName = $state.current.phase;

		// determine current page
		$scope.isOrderPage = stateName === 'order';
		$scope.isCheckoutPage = stateName === 'checkout';
		$scope.isPickupPage = stateName === 'pickup';

		// ensure route url is such that only one page is active at a time
		checkForPageError();
	});
}]);