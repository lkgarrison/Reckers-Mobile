describe('Controller: checkout-controller', function () {
	var cartService = jasmine.createSpyObj('cartService', ['getCart', 'getTotal', 'removeItem', 'emptyCart']);
	var $mdDialog = jasmine.createSpyObj('$mdDialog', ['show', 'confirm', 'parent', 'title', 'content', 'ok', 'cancel']);
	$mdDialog.confirm.and.returnValue($mdDialog);
	$mdDialog.parent.and.returnValue($mdDialog);
	$mdDialog.title.and.returnValue($mdDialog);
	$mdDialog.content.and.returnValue($mdDialog);
	$mdDialog.ok.and.returnValue($mdDialog);
	$mdDialog.cancel.and.returnValue($mdDialog);

	beforeEach(module('app'));

	var $rootScope, $scope, $state, $controller, $q;
	var target;
	beforeEach(inject(function(_$rootScope_, _$q_, _$controller_, _$state_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$state = _$state_;
		$q = _$q_;
		$controller = _$controller_;

		target = $controller('checkoutController', {
			$scope: $scope,
			$state: $state,
			$mdDialog: $mdDialog,
			CartService: cartService
		});
	}));

	var deferred;
	function confirmModal() {
		deferred = $q.defer();
	
		$mdDialog.show.and.callThrough();
		deferred.resolve();

		$mdDialog.show.and.returnValue(deferred.promise);
	}

	it('should be defined', function() {
		expect(target).toBeDefined();
	});

	describe('commafyIngredients', function () {
		var ingredientsArray = ['chicken', 'tomato', 'cheese'];

		it('should return undefined if ingredientsArray is undefined', function () {
			expect($scope.commafyIngredients(undefined)).toEqual(undefined);
		});

		it('should not return a string that ends with a comma', function () {
			var result = $scope.commafyIngredients(ingredientsArray);
			result = result[result.length - 1] !== ',';
			expect(result).toBeTruthy();
		});

		it('should return a string of comma-separated ingredients', function () {
			expect($scope.commafyIngredients(ingredientsArray)).toEqual('chicken, tomato, cheese');
		});
	});

	describe('remove', function () {
		it('should call CartService.removeItem', function () {
			$scope.remove(0);
			expect(cartService.removeItem).toHaveBeenCalled();
		});
	});

	describe('confirmCancel', function () {
		it('should show confirm dialog', function () {
			confirmModal();
			$scope.confirmCancel();

			expect($mdDialog.show).toHaveBeenCalled();
		});

		// TODO:
		// test that cartservice gets called when cancel confirm modal is resolved (but not when rejected)
	});

	describe('cart-updated event', function () {
		it('should update controller\'s copy of the cart', function () {
			$rootScope.$broadcast('cart-updated');
			expect(cartService.getCart).toHaveBeenCalled();
		});

		it('should update controller\'s copy of the total cost', function () {
			$rootScope.$broadcast('cart-updated');
			expect(cartService.getTotal).toHaveBeenCalled();
		});
	});

	describe('payment information', function () {
		it('should store all 12 months for credit card expiration date selection', function () {
			expect($scope.months).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']);
		});
	});
});
