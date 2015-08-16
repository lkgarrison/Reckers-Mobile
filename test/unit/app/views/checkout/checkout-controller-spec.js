// 'use strict';

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
	beforeEach(inject(function(_$rootScope_, _$state_, _$q_, _$controller_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		state = _$state_;
		$q = _$q_;
		$controller = _$controller_;

		target = $controller('checkoutController', {
			$scope: $scope,
			$state: state,
			$mdDialog: $mdDialog,
			CartService: cartService
		});
	}));

	var deferred;
	function confirmModal() {
		deferred = $q.defer();
		$mdDialog.cancel.and.returnValue(deferred.promise);
		$mdDialog.show.and.returnValue(deferred.promise);
		deferred.resolve();
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

		fit('should clear the cart', function () {
			confirmModal();

			$scope.confirmCancel();

			expect(cartService.emptyCart).toHaveBeenCalled();
		});
	});
});