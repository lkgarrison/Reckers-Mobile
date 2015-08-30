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

	var mockItem;
	beforeEach(function () {
		mockItem = {};
	});

	var ingredientsArray = ['chicken', 'tomato', 'cheese'];
	var option = 'Regular';

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

	describe('getOptionsAndIngredients', function () {

		describe('when item has no option selected', function () {
			beforeEach(function () {
				mockItem.option = undefined;
				mockItem.selectedIngredients = ingredientsArray;
			});

			it('and no selected ingredients, the string should be empty', function () {
				mockItem.selectedIngredients = [];
				expect(target.getOptionsAndIngredients(mockItem)).toEqual('');
			});

			it('and has selected ingredients, it should not return a string that ends with a comma', function () {
				var result = target.getOptionsAndIngredients(mockItem);
				result = result[result.length - 1] !== ',';
				expect(result).toBeTruthy();
			});

			it('and has selected ingredients, it should return a string of comma-separated ingredients', function () {
				expect(target.getOptionsAndIngredients(mockItem)).toEqual('chicken, tomato, cheese');
			});
		});

		it('should return the option when item has an option but no ingredients', function () {
			mockItem.option = option;
			mockItem.selectedIngredients = undefined;

			expect(target.getOptionsAndIngredients(mockItem)).toEqual(option);
		});

		it('should return option + separator + ingredients string when item has option and ingredients', function () {
			mockItem.option = option;
			mockItem.selectedIngredients = ingredientsArray;
			var separator = ': ';

			expect(target.getOptionsAndIngredients(mockItem)).toEqual(option + separator + 'chicken, tomato, cheese');
		});
	});

	describe('remove', function () {
		it('should call CartService.removeItem', function () {
			target.remove(0);
			expect(cartService.removeItem).toHaveBeenCalled();
		});
	});

	describe('confirmCancel', function () {
		it('should show confirm dialog', function () {
			confirmModal();
			target.confirmCancel();

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
			expect(target.months).toEqual(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']);
		});
	});
});
