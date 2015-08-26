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

	var mockItem;
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
			"index": 41,
			"$$hashKey": "object:50"
		};
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

		it('should return false if item to remove doesn\'nt exist in cart', function () {
			invalidItem = mockItem;
			invalidItem.name = 'invalid item';
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
});