app.directive("collapsibleSectionHeader", ['MenuService', function (MenuService) {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'collapsibleSectionDirective.html',
		controller: function ($scope, $timeout) {
			/* make Menu service data accessible to directive's html
			 * use $timeout to make sure $digest cycle is complete
			 */
			$timeout(function () {
				MenuService.getMenu().then(function (menuData) {
					$scope.menu = menuData;
				});
			});

			$scope.menuTypes = MenuService.getMenuTypes();
				
		},
		link: function () {
			// apply JQuery "collapsible" attribute to each element of class "menuHeader"
			$(".menuHeader").collapsible({
				collapsible: true,
			});
		}
	};
}]);
