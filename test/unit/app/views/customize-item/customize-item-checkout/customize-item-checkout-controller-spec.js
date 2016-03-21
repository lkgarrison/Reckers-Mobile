describe('customize-item-checkout-controller', function () {
	var cartService = jasmine.createSpyObj('cartService', ['addItem', 'saveItem', 'getCart']);

	beforeEach(module('app'));
	beforeEach(module('templates'));

	var ingredients = ['lettuce', 'tomato', 'cheese'];
	var mockCart;
	beforeEach(function () {
		mockCart = [{
			selectedIngredients: ingredients,
			options: [['Large', 5.00], ['Regular', 3.50]],
			option: 'Regular'
		}];
	});

	beforeEach(function () {
		cartService.getCart.and.returnValue(mockCart);
	});

	var $rootScope, $scope, $state, $timeout, $q, $controller;
	var target;
	beforeEach(inject(function(_$rootScope_, _$state_, _$q_, _$controller_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$state = _$state_;
		$q = _$q_;
		$controller = _$controller_;

		target = $controller('customizeItemCheckoutController', {
			$scope: $scope,
			$state: $state,
			$timeout: $timeout,
			$stateParams: { cartIndex: 0 },
			CartService: cartService
		});
	}));

	it('should be defined', function() {
		expect(target).toBeDefined();
	});

	describe('ingredients', function () {
		it('should be removed by toggleIngredient function', function () {
			target.toggleIngredient('lettuce');

			expect(target.isSelectedIngredient('lettuce')).toEqual(false);
		});

		it('should be re-added by toggleIngredient function', function () {
			target.toggleIngredient('cheese');
			target.toggleIngredient('cheese');

			expect(target.isSelectedIngredient('cheese')).toEqual(true);
		});
	});

	describe('saveItem', function () {
		beforeEach(function () {
			cartService.saveItem.and.returnValue(true);
		});

		it('should call cartService.saveItem', function () {
			target.saveItem();

			expect(cartService.saveItem).toHaveBeenCalled();
		});

		it('should return false if cartService.saveItem returns false', function () {
			cartService.saveItem.and.returnValue(false);

			expect(target.saveItem()).toEqual(false);
		});

		it('should go to checkout page if successful', function () {
			spyOn($state, 'go');
			target.saveItem();

			expect($state.go).toHaveBeenCalledWith('root.checkout');
		});

		it('should return true if successful', function () {
			expect(target.saveItem()).toEqual(true);
		});
	});

	describe('save button', function () {
		it('should not display item option message before clicked if item has options and no option is selected', function () {
			expect(target.shouldDisplayItemOptionsMessage()).toEqual(false);
		});

		it('should display item option message when clicked if item has options and no option is selected', function () {
			target.saveItem();	// simulates clicking "add" button
			target.item.option = undefined;

			expect(target.shouldDisplayItemOptionsMessage()).toEqual(true);
		});

		it('should not display item option message when clicked if item has options and an option is selected', function () {
			target.item.option = 'Regular';	// simulates choosing an option
			target.saveItem();	// simulates clicking "add" button

			expect(target.shouldDisplayItemOptionsMessage()).toEqual(false);
		});
	});
});
