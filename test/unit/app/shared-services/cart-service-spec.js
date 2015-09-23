describe('cart-service', function () {

	beforeEach(module('CartService'));

	var eventService = jasmine.createSpyObj('eventService', ['broadcast']);
	module(function ($provide) {
		$provide.value('EventService', eventService);
	});

	var cartService;
	beforeEach(inject(function(_CartService_){
		cartService = _CartService_;
	}));

	var mockItem, mockItem2;
	beforeEach(function () {
		mockItem = {
			"name": "Chicken Alfredo Pizza",
			"type": "pizza",
			"price": 6.45,
			"qty": 1,
			"description": "Alfredo sauce, chicken, spinach and Mozzarella and Provolone cheeses.",
			"availableIngredients": [
				"Alfredo sauce",
				"Chicken",
				"Spinach",
				"Mozzarella and Provolone cheeses"
			],
			"selectedIngredients": [
				"Alfredo sauce",
				"Chicken",
				"Spinach",
				"Mozzarella and Provolone cheeses"
			],
			"options": [['Large', 5.00], ['Regular', 3.50]],
			"option": 'Regular',
			"index": 5,
			"$$hashKey": "object:50"
		};

		mockItem2 = _.clone(mockItem);
	});

	describe('initialization', function () {
		it('should be defined', function () {
			expect(cartService).toBeDefined();
		});

		it('should initialize total quantity to 0', function () {
			expect(cartService._totalQuantity).toEqual(0);
		});

		it('should initialize total cost to 0', function () {
			expect(cartService._total).toEqual(0);
		});

		it('should initialize an empty cart', function () {
			expect(cartService._cart).toEqual([]);
		});
	});

	describe('addItem', function () {
		beforeEach(function () {
			cartService.addItem(mockItem);
		});

		it('should add item to cart', function () {
			expect(cartService._cart.length).toEqual(1);
		});

		it('should update total quantity', function () {
			expect(cartService._totalQuantity).toEqual(1);
		});

		it('should update total cost', function () {
			expect(cartService._total).toEqual(mockItem.price);
		});

		it('should set item quantity to 1 the first time the item is added', function () {
			expect(cartService._cart[0].qty).toEqual(1);
		});

		it('should increment the item\'s quantity when the same item is added', function () {
			cartService.addItem(mockItem);

			expect(cartService._cart[0].qty).toEqual(2);
		});

		it('should omit $$hashKey property on item', function () {
			expect(cartService._cart[0].hasOwnProperty('$$hashKey')).toEqual(false);
		});

		it('should return false if item has options but none are selected', function () {
			mockItem.option = undefined;
			expect(cartService.addItem(mockItem)).toEqual(false);
		});

		it('should return true if item has no options', function () {
			mockItem.options = undefined;
			expect(cartService.addItem(mockItem)).toEqual(true);
		});

		it('should return true if item is added successfully', function () {
			expect(cartService.addItem(mockItem)).toEqual(true);
		});

		it('should broadcast that the cart was updated', function () {
			spyOn(cartService, "_broadcastCartUpdate");
			cartService.addItem(mockItem);

			expect(cartService._broadcastCartUpdate).toHaveBeenCalled();
		});
	});

	describe('removeItem', function () {
		beforeEach(function () {
			cartService.addItem(mockItem);
		});

		it('should return false if item to remove doesn\'t exist in cart', function () {
			invalidItem = mockItem;
			invalidItem.index = 6;
			var result = cartService.removeItem(invalidItem);

			expect(result).toEqual(false);
		});

		it('should decrement the item\'s quantity when an item is removed that already exists in the cart', function () {
			cartService.addItem(mockItem);
			mockItem.qty = 2;
			cartService.removeItem(mockItem);

			expect(cartService._cart[0].qty).toEqual(1);
			expect(cartService._cart.length).toEqual(1);
		});

		it('should remove the item from the cart if the quantity of the item was 1', function () {
			mockItem.qty = 1;
			cartService.removeItem(mockItem);

			expect(cartService._cart.length).toEqual(0);
		});

		it('should decrement totalQuantity', function () {
			cartService.removeItem(mockItem);

			expect(cartService._totalQuantity).toEqual(0);
		});

		it('should update total cost', function () {
			cartService.removeItem(mockItem);

			expect(cartService._total).toEqual(0);
		});

		it('should broadcast that the cart was updated', function () {
			spyOn(cartService, "_broadcastCartUpdate");
			cartService.removeItem(mockItem);

			expect(cartService._broadcastCartUpdate).toHaveBeenCalled();
		});
	});

	describe('saveItem', function () {
		beforeEach(function () {
			cartService.addItem(mockItem);
			mockItem2.selectedIngredients = ['Chicken', 'Spinach'];
		});

		it('should return false if cartIndex is < 0', function () {
			expect(cartService.saveItem(mockItem2, -1)).toEqual(false);
		});

		it('should return false if cartIndex is >= cart.length', function () {
			expect(cartService.saveItem(mockItem2, 5)).toEqual(false);
		});

		it('should return false if item has options but none are selected', function () {
			mockItem.option = undefined;
			expect(cartService.addItem(mockItem)).toEqual(false);
		});

		it('should return true if the specified item is updated successfully', function () {
			expect(cartService.saveItem(mockItem2, 0)).toEqual(true);
		});

		it('should call broadcastCartUpdate', function () {
			spyOn(cartService, '_broadcastCartUpdate');
			cartService.saveItem(mockItem2, 0);
			expect(cartService._broadcastCartUpdate).toHaveBeenCalled();
		});

		it('should return true and make no changes if the item is saved without changes', function () {
			expect(cartService.saveItem(mockItem, 0)).toEqual(true);
			expect(cartService._cart.length).toEqual(1);
			mockItem = _.omit(mockItem, "$$hashKey");
			expect(cartService._cart[0]).toEqual(mockItem);
		});

		describe('when original item quantity is 1', function () {
			it('should remove old item and append updated item if updated item does not already exist in cart', function () {
				mockItem.qty = 1;
				mockItem.selectedIngredients = ['Chicken'];
				cartService.saveItem(mockItem, 0);

				expect(cartService._cart.length).toEqual(1);
				expect(cartService._cart[0].selectedIngredients).toEqual(mockItem.selectedIngredients);
				expect(cartService._cart[0].qty).toEqual(1);
			});

			it('should remove old item and increment the quantity of the updated item if the updated item already exists in the cart', function () {
				// add another item to the cart. The original item will be saved to be the same as mockItem2
				mockItem2.selectedIngredients = ['Chicken', 'Spinach'];
				cartService.addItem(mockItem2);
				expect(cartService._cart.length).toEqual(2);

				cartService.saveItem(mockItem2, 0);
				expect(cartService._cart.length).toEqual(1);
				expect(cartService._cart[0].qty).toEqual(2);
				expect(cartService._cart[0].selectedIngredients).toEqual(mockItem2.selectedIngredients);
			});
		});

		describe('when original item quantity > 1', function () {
			beforeEach(function () {
				cartService.addItem(mockItem);
				mockItem2.selectedIngredients = ['Chicken', 'Spinach'];
			});

			it('should decrement the original item\'s quantity and append the updated item if updated item does not already exist in cart', function () {
				expect(cartService._cart.length).toEqual(1);
				expect(cartService._cart[0].qty).toEqual(2);

				cartService.saveItem(mockItem2, 0);
				expect(cartService._cart.length).toEqual(2);
				expect(cartService._cart[0].qty).toEqual(1);
				expect(cartService._cart[1].qty).toEqual(1);
			});

			it('should decrement the original item\'s quantity and increment the qty of the updated item if it already exists in the cart', function () {
				cartService.addItem(mockItem2);
				expect(cartService._cart.length).toEqual(2);
				expect(cartService._cart[0].qty).toEqual(2);

				cartService.saveItem(mockItem2, 0);
				expect(cartService._cart[0].qty).toEqual(1);
				expect(cartService._cart[1].qty).toEqual(2);
				expect(cartService._cart.length).toEqual(2);
			});
		});

		describe('when item option is updated', function () {
			beforeEach(function () {
				mockItem2.price = 3.50;
				mockItem2.option = "Large";
				cartService.saveItem(mockItem2, 0);
			});

			it('should update price of item', function () {
				expect(cartService._cart[0].price).toEqual(5.00);
			});

			it('should update total cost for cart', function () {
				expect(cartService._total).toEqual(5.00);
			});
		});
	});

	describe('getTotal', function () {
		it('should return total', function () {
			cartService.addItem(mockItem);
			var result = cartService.getTotal();

			expect(result).toEqual(mockItem.price);
		});
	});

	describe('getTotalQuantity', function () {
		it('should return total quantity', function () {
			cartService.addItem(mockItem);
			var result = cartService.getTotalQuantity();

			expect(result).toEqual(1);
		});
	});

	describe('getCart', function () {
		it('should return cart', function () {
			cartService.addItem(mockItem);
			var result = cartService.getCart();
			mockItem.qty = 1;
			mockItem = _.omit(mockItem, '$$hashKey');
			mockCart = [];
			mockCart.push(mockItem);

			expect(result).toEqual(mockCart);
			// ensure deep copy was made
			result = [];
			expect(result).not.toEqual(cartService.getCart());
		});
	});

	describe('emptyCart', function () {
		beforeEach(function () {
			cartService.addItem(mockItem);
			cartService.emptyCart();
		});

		it('should reset the cart', function () {
			expect(cartService._cart).toEqual([]);
		});

		it('should reset the total cost', function () {
			expect(cartService._total).toEqual(0);
		});

		it('should reset the total quantity', function () {
			expect(cartService._totalQuantity).toEqual(0);
		});

		it('should broadcast that the cart was updated', function () {
			spyOn(cartService, "_broadcastCartUpdate");
			cartService.addItem(mockItem);
			cartService.emptyCart();

			expect(cartService._broadcastCartUpdate).toHaveBeenCalled();
		});
	});

	describe('getIndex', function () {
		it('should return false if the cart is empty', function () {
			expect(cartService.getIndex(mockItem)).toEqual(false);
		});

		it('should return false if the item does not exist in the cart', function () {
			cartService.addItem(mockItem);
			mockItem2.index = 6;
			expect(cartService.getIndex(mockItem2)).toEqual(false);
		});

		it('should distinguish items based on their menuIndex', function () {
			cartService.addItem(mockItem);
			mockItem2.index = 6;
			cartService.addItem(mockItem2);

			expect(cartService.getIndex(mockItem)).toEqual(0);
			expect(cartService.getIndex(mockItem2)).toEqual(1);
		});

		it('should distinguish items based on their selected ingredients', function () {
			cartService.addItem(mockItem);
			mockItem2.selectedIngredients = ['Chicken', 'Spinach'];
			cartService.addItem(mockItem2);

			expect(cartService.getIndex(mockItem)).toEqual(0);
			expect(cartService.getIndex(mockItem2)).toEqual(1);
		});

		it('should distinguish items based on their selected option', function () {
			cartService.addItem(mockItem);
			mockItem2.option = 'Large';
			cartService.addItem(mockItem2);

			expect(cartService.getIndex(mockItem)).toEqual(0);
			expect(cartService.getIndex(mockItem2)).toEqual(1);
		});
	});
});