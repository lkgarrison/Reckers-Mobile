var cartService = angular.module('CartService', ['EventBus']);

cartService.service('CartService', ['EventService', function (EventService) {
	this._cart = [];
	this._total = 0;
	this._totalQuantity = 0;

	this.addItem = function (item) {
		var existingCartIndex = this._getIndex(item);

		// ensure angular sees cart's items as unique
		item = _.omit(item, '$$hashKey');
		if (existingCartIndex === false) {
			item.qty = 1;
			this._cart.push(item);
		} else {
			this._cart[existingCartIndex].qty++;
		}

		this._totalQuantity++;
		this._total += item.price;
		this._broadcastCartUpdate();
	};

	this.removeItem = function (item) {
		var cartIndex = this._getIndex(item);
		if (cartIndex === false) {
			console.error('Unable to remove item');

			return false;
		}

		if (item.qty > 1) {
			this._cart[cartIndex].qty--;
		} else {
			// remove the item from the cart since it had a qty of 1
			this._cart.splice(cartIndex, 1);
		}

		this._totalQuantity--;
		this._total -= item.price;
		this._broadcastCartUpdate();

		return true;
	};

	this.getTotal = function () {
		return this._total;
	};

	this.getTotalQuantity = function () {
		return this._totalQuantity;
	};

	this.getCart = function () {
		return this._cart;
	};

	this.emptyCart = function () {
		this._cart = [];
		this._total = 0;
		this._totalQuantity = 0;
		this._broadcastCartUpdate();
	};

	this._broadcastCartUpdate = function() {
		EventService.broadcast('cart-updated');
	};

	// return index of item if it already exists in the cart. If new item is unique, returns false
	this._getIndex = function(newItem) {
		if (this._cart.length === 0) {
			return false;
		}

		// cart.forEach(function (item, index) {
		for (var i = 0; i < this._cart.length; i++) {
			var item = this._cart[i];

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
	};
}]);
