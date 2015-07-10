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

			$scope.testBroadcast = function () {
				EventService.broadcast('testingBroadcast', {'key': 'value'});
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
