angular.module('app').controller('headerFooterController', ['$scope', '$state', 'CartService', function ($scope, $state, CartService) {
	$scope.quantity = 0;

	$scope.$on('item-added', function () {
		$scope.quantity = CartService.getTotalQuantity();
	});

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