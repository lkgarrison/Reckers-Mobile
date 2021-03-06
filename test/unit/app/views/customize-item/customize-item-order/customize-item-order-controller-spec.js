describe('customize-item-order-controller', function () {
	var cartService = jasmine.createSpyObj('cartService', ['addItem']);
	var menuService = jasmine.createSpyObj('menuService', ['getMenu']);

	beforeEach(module('app'));
	beforeEach(module('templates'));

	var $rootScope, $scope, $state, $timeout, $q, $controller;
	var target;
	beforeEach(inject(function(_$rootScope_, _$state_, _$timeout_,  _$q_, _$controller_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		$state = _$state_;
		$timeout = _$timeout_;
		$q = _$q_;
		$controller = _$controller_;

		target = $controller('customizeItemOrderController', {
			$scope: $scope,
			$state: $state,
			$timeout: $timeout,
			$stateParams: { menuIndex: 0 },
			CartService: cartService,
			MenuService: menuService
		});
	}));

	var deferred;
	var ingredients = ['lettuce', 'tomato', 'cheese'];
	var menuData = [{
		availableIngredients: ingredients,
		options: [['Large', 5.00], ['Regular', 3.50]]
	}];
	function getMenuAsync() {
		deferred = $q.defer();
		menuService.getMenu.and.returnValue(deferred.promise);
		deferred.resolve(menuData);
	}

	it('should be defined', function() {
		expect(target).toBeDefined();
	});

	describe('ingredients', function () {
		beforeEach(function () {
			getMenuAsync();
			$timeout.flush();
		});

		it('should all be selected initially', function () {
			_.each(ingredients, function(ingredient) {
				expect(target.isSelectedIngredient(ingredient)).toEqual(true);
			});
		});

		it('should be removed by toggleIngredient function', function () {
			target.toggleIngredient('lettuce');

			expect(target.isSelectedIngredient('lettuce')).toEqual(false);
		});

		it('should be re-added by toggleIngredient function', function () {
			target.toggleIngredient('lettuce');
			target.toggleIngredient('lettuce');

			expect(target.isSelectedIngredient('lettuce')).toEqual(true);
		});
	});

	describe('addItem', function () {
		beforeEach(function () {
			getMenuAsync();
			$timeout.flush();
			cartService.addItem.and.returnValue(true);
		});

		it('should call cartService.addItem', function () {
			target.addItem();

			expect(cartService.addItem).toHaveBeenCalled();
		});

		it('should return false if cartService.addItem returns false', function () {
			cartService.addItem.and.returnValue(false);

			expect(target.addItem()).toEqual(false);
		});

		it('should transition to order state', function () {
			spyOn($state, 'go');
			target.addItem();

			expect($state.go).toHaveBeenCalledWith('root.order');
		});

		it('should return true if cartService.addItem returns true', function () {
			expect(target.addItem()).toEqual(true);
		});
	});

	describe('add button', function () {
		beforeEach(function () {
			getMenuAsync();
			$timeout.flush();
		});

		it('should not display item option message before clicked if item has options and no option is selected', function () {
			expect(target.shouldDisplayItemOptionsMessage()).toEqual(false);
		});

		it('should display item option message when clicked if item has options and no option is selected', function () {
			target.addItem();	// simulates clicking "add" button

			expect(target.shouldDisplayItemOptionsMessage()).toEqual(true);
		});

		it('should not display item option message when clicked if item has options and an option is selected', function () {
			target.item.option = 'Regular';	// simulates choosing an option
			target.addItem();	// simulates clicking "add" button

			expect(target.shouldDisplayItemOptionsMessage()).toEqual(false);
		});
	});
});
