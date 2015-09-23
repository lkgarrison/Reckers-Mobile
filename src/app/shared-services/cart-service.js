var cartService = angular.module('CartService', ['EventBus']);

cartService.service('CartService', ['EventService', function (EventService) {
	this._cart = [];
	this._total = 0;
	this._totalQuantity = 0;

	this.addItem = function (item) {
		if (!this._validateItem(item)) {
			return false;
		}

		var existingCartIndex = this.getIndex(item);
		item.price = getPrice(item);

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

		return true;
	};

	this.removeItem = function (item) {
		var cartIndex = this.getIndex(item);
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

	// @param item should be the item object with the new changes
	// @param cartIndex is the cartIndex that the original item was at before the changes were made
	this.saveItem = function (item, cartIndex) {
		if (cartIndex < 0 || cartIndex >= this._cart.length) {
			return false;
		}

		if (!this._validateItem(item)) {
			return false;
		}

		item = _.omit(item, '$$hashKey');
		item = _.cloneDeep(item);	// work with a copy of the item only
		item.qty = 1;				// only working with 1 of the item at a time

		// subtract old item w/o changes' price
		this._total -= item.price;
		item.price = getPrice(item);

		// add cost of saved item (ie updated options)
		this._total += item.price;

		var existingCartIndex = this.getIndex(item);
		// check if user tried to save the item without any changes
		if (parseInt(cartIndex) === existingCartIndex) {
			return true;
		}

		if (this._cart[cartIndex].qty === 1) {
			if (existingCartIndex === false) {
				// safe to overwrite old item properties, the new item doesn't already exist
				this._cart[cartIndex] = item;
			} else {
				// remove instance of old item in cart, increment qty of new item (already in cart)
				this._cart[existingCartIndex].qty++;
				this._cart.splice(cartIndex, 1);
			}
		} else {
			// decrement original item's quantity
			this._cart[cartIndex].qty--;

			if (!existingCartIndex) {
				// if item wasn't already in cart, add it
				this._cart.push(item);
			} else {
				// if new item is already in cart, just increment its quantity
				this._cart[existingCartIndex].qty++;
			}
		}

		this._broadcastCartUpdate();

		return true;
	};

	this.getTotal = function () {
		return _.cloneDeep(this._total);
	};

	this.getTotalQuantity = function () {
		return _.cloneDeep(this._totalQuantity);
	};

	this.getCart = function () {
		return _.cloneDeep(this._cart);
	};

	this.emptyCart = function () {
		this._cart = [];
		this._total = 0;
		this._totalQuantity = 0;
		this._broadcastCartUpdate();
	};

	function getPrice(item) {
		if (item.option === undefined || item.options === undefined) {
			return item.price;
		}

		// Option description is stored in index 0, price in index 1
		for (var i = 0; i < item.options.length; i++) {
			if (item.option === item.options[i][0]) {
				return item.options[i][1];
			}
		}

		return item.price;
	}

	// return index of item if it already exists in the cart. If new item is unique, returns false
	this.getIndex = function(newItem) {
		if (this._cart.length === 0) {
			return false;
		}

		// cart.forEach(function (item, index) {
		for (var i = 0; i < this._cart.length; i++) {
			var item = this._cart[i];

			if (newItem.index !== item.index) {
				continue;
			} else if (newItem.option !== item.option) {
				continue;
			} else if (_.xor(newItem.selectedIngredients, item.selectedIngredients).length !== 0) {
				continue;
			}

			return i;
		}

		return false;
	};

	this._broadcastCartUpdate = function() {
		EventService.broadcast('cart-updated');
	};

	this._validateItem = function (item) {
		if (item.options !== undefined && item.option === undefined) {
			return false;
		}

		return true;
	};
}]);
