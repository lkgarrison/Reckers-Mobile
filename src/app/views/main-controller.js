/* This controller is primarily used to display popups broadcast from the EventService */
angular.module('app').controller('mainController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
	$scope.$on('no-items-in-cart-error', function () {
		$("#emptyCartMessage").popup("open");
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.body))
				.title('Empty Cart')
				.content('Add items to your cart first!')
				.ok('Okay!')
		);
	});
}]);