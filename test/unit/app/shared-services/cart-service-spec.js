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
			"qty": 0,
			"description": "Alfredo sauce, chicken, spinach and Mozzarella and Provolone cheeses.",
			"ingredients": [
				"Alfredo sauce",
				"Chicken",
				"Spinach",
				"Mozzarella and Provolone cheeses"
			],
			options: [['Large', 5.00], ['Regular', 3.50]],
			option: 'Regular',
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

		// fit('should broadcast that the cart was updated', function () {
		// 	eventService.broadcast.and.callThrough();
		// 	expect(eventService.broadcast).toHaveBeenCalled();
		// });
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

		// it('should broadcast that the cart was updated', function () {
		// 	cartService.removeItem(mockItem);

		// 	expect(eventService.broadcast).toHaveBeenCalled();
		// });
	});

	describe('saveItem', function () {
		beforeEach(function () {
			cartService.addItem(mockItem);
			mockItem2.ingredients = ['Chicken', 'Spinach'];
		});

		it('should return false if cartIndex is < 0', function () {
			expect(cartService.saveItem(mockItem2, -1)).toEqual(false);
		});

		it('should return false if cartIndex is >= cart.length', function () {
			expect(cartService.saveItem(mockItem2, 5)).toEqual(false);
		});

		it('should return true if the specified item is updated successfully', function () {
			expect(cartService.saveItem(mockItem2, 0)).toEqual(true);
		});

		it('should update the item at the specified cart index', function () {
			cartService.saveItem(mockItem2, 0);
			expect(cartService._cart[0]).toEqual(mockItem2);
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

		// it('should broadcast that the cart was updated', function () {
		// 	expect(eventService.broadcast).toHaveBeenCalled();
		// });
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
			mockItem2.ingredients = ['Chicken', 'Spinach'];
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