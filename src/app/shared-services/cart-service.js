var cartService = angular.module('CartService', ['EventBus']);

cartService.service('CartService', ['EventService', function (EventService) {
	var cart = [];
	var total = 0;
	var totalQuantity = 0;

	this.addItem = function (item) {
		cart.push(item);
		totalQuantity++;
		total += item.price;
		EventService.broadcast('item-added');
	};

	this.getTotal = function () {
		return total;
	};

	this.getTotalQuantity = function () {
		return totalQuantity;
	};

	this.getCart = function () {
		return cart;
	};
}]);
