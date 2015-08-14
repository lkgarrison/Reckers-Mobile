// 'use strict';

describe('Controller: checkout-controller', function () {
	var CartService = jasmine.createSpyObj('CartService', ['getCart', 'getTotal', 'removeItem', 'emptyCart']);
	var $mdDialog = jasmine.createSpyObj('$mdDialog', ['show', 'confirm']);

	beforeEach(module('app'));

	var $rootScope, $scope, $state, $controller;
	var target;
	beforeEach(inject(function(_$rootScope_, _$state_, _$controller_) {
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
		state = _$state_;
		$controller = _$controller_;

		target = $controller('checkoutController', {
			$scope: $scope,
			$state: state,
			$mdDialog: $mdDialog,
			CartService: CartService
		});
	}));

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
});