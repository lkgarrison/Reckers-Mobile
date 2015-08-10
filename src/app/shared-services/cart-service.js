var cartService = angular.module('CartService', ['EventBus']);

cartService.service('CartService', ['EventService', function (EventService) {
	var cart = [];
	var total = 0;
	var totalQuantity = 0;

	this.addItem = function (item) {
		var existingCartIndex = getIndex(item);

		// ensure angular sees cart's items as unique
		item = _.omit(item, '$$hashKey');
		if (existingCartIndex === false) {
			item.qty = 1;
			cart.push(item);
		} else {
			cart[existingCartIndex].qty++;
		}

		totalQuantity++;
		total += item.price;
		EventService.broadcast('item-added');
	};

	this.removeItem = function (item) {
		var cartIndex = getIndex(item);
		if (cartIndex === false) {
			console.error('Unable to remove item');

			return;
		}

		if (item.qty > 1) {
			cart[cartIndex].qty--;
		} else {
			// remove the item from the cart since it had a qty of 1
			cart.splice(cartIndex, 1);
		}

		total -= item.price;
		EventService.broadcast('cart-updated');
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

	// return index of item if it already exists in the cart. If new item is unique, returns false
	function getIndex(newItem) {
		if (cart.length === 0) {
			return false;
		}

		// cart.forEach(function (item, index) {
		for (var i = 0; i < cart.length; i++) {
			var item = cart[i];

			if (newItem.name !== item.name) {
				continue;
			} else if (newItem.type !== item.type) {
				continue;
			} else if (newItem.price !== item.price) {
				continue;
			} else if (newItem.description !== item.description) {
				continue;
			} else if (newItem.index !== item.index) {
				continue;
			} else if (newItem.option !== item.option) {
				continue;
			} else if (_.xor(newItem.ingredients, item.ingredients).length !== 0) {
				continue;
			}

			return i;
		}

		return false;
	}
}]);
