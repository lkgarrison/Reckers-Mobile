app.directive("collapsibleSectionHeader", ['MenuService', 'EventService', function (MenuService, EventService) {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'collapsibleSectionDirective.html',
		controller: function ($scope, $timeout) {
			/* make Menu service data accessible to directive's html
			 * use $timeout to ensure $digest cycle is complete and $scope is applied
			 */
			$timeout(function () {
				MenuService.getMenu().then(function (menuData) {
					$scope.menu = menuData;
				});
			});
			
			$scope.menuTypes = MenuService.getMenuTypes();

			// broadcast request to open customize item popup for order page. Passes menuIndex of item
			$scope.broadcastCustomizeItemRequest = function (menuIndex) {
				console.log("here: " + menuIndex);
				EventService.broadcast('customizeItem-order', menuIndex);
			};
		},
		link: function () {
			// apply JQuery "collapsible" attribute to each element of class "menuHeader"
			$(".menuHeader").collapsible({
				collapsible: true,
			});
		}
	};
}]);
