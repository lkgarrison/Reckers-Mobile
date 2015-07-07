app.directive("collapsibleSectionHeader", ['Menu', function (Menu) {
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
				Menu.getMenu().then(function (menuData) {
					$scope.menu = menuData;
					console.log($scope.menu);

				});
				
				Menu.getMenuTypes().then(function (menuTypes) {
					$scope.menuTypes = menuTypes;
					console.log($scope.menuTypes);
				});
			});
				
		},
		link: function () {
			// apply JQuery "collapsible" attribute to each element of class "menuHeader"
			$(".menuHeader").collapsible({
				collapsible: true,
			});
		}
	};
}]);
