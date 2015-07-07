var menuService = angular.module('menuService', []);

menuService.service('Menu', function () {
	Parse.initialize("CZtjkZAV9gQzln2C3KKi7vsXRl4ppAMenjXiPGrx", "LVzkRhUfya9rMXDxGlda88o9d8XkPvd19YJdgWC6");
	var query = new Parse.Query("Menu");
	var menu = [];
	var menuTypes = [];

	var menuPromise = query.find()
	.then(
		function (results) {
			var counter = 0;
			// Add one promise for each item into an array (menu)
			_.each(results, function(result) {
				// Start adding the result to the menu immediately
				menu.push({
					item: result.get("item"),
					type: result.get("type"),
					price: result.get("price"),
					qty: 0,
					description: result.get("description"),
					ingredients: result.get("ingredients"),
					options: result.get("prices"),
					id: counter++
				});
			});
			// Return a new promise that is resolved when all items are retrieved and added to the menu array.
			return Parse.Promise.when(menu);
		},
		function (error) {
			console.error(error);
		})
	.then(function () {
		// when menu is entirely downloaded, create array of menu types (no repeats)
		var allTypesRepeated = _.pluck(menu, 'type');
		menuTypes = _.unique(allTypesRepeated);

		/* return a resolved promise immediately */
		return new Parse.Promise().resolve();
	});

	this.getMenu = function () {
		return menuPromise.then(function () {
			return menu;
		});
	};

	/* create an array of unique types of food in the menu (no repeats) */
	this.getMenuTypes = function () {
		return menuPromise.then(function () {
			return menuTypes;
		});
	};

	/* function returns a promise that resolves when the menu data has loaded */
	this.whenMenuDataIsLoaded = function () {
		return menuPromise.then(function () {
			return true;
		});
	};
});