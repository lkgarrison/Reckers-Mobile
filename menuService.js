var menuService = angular.module('MenuService', ['appConfig']);

menuService.service('MenuService', ['configService', function (configService) {
	Parse.initialize("CZtjkZAV9gQzln2C3KKi7vsXRl4ppAMenjXiPGrx", "LVzkRhUfya9rMXDxGlda88o9d8XkPvd19YJdgWC6");
	var query = new Parse.Query("Menu");
	var menu = [];
	var parseMenuTypes = [];
	var menuTypes = configService.getCollapsibleSetOrder();

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
		parseMenuTypes = _.unique(allTypesRepeated);

		/* return a resolved promise immediately */
		return new Parse.Promise().resolve();
	});

	this.getMenu = function () {
		return menuPromise.then(function () {
			return menu;
		});
	};

	this.getMenuTypes = function () {
		return menuTypes;
	};

	// when menuTypes from menu service become available, make sure configured food types are legitimate food types from the Parse Menu
	var validateConfiguredMenuTypes = function() {
		getMenuTypes().then(function (menuTypes) {
			_.each(collapsibleSetOrder, function (foodType) {
				if(menuTypes.indexOf(foodType) === -1) {
					console.error('"' + foodType + '"' + " is not a valid food type. It not match any of the food types specified in the menu on Parse. Please check the app.config settings.");
				}
			});
		});
	};
}]);