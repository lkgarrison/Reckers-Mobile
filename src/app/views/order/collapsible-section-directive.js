app.directive("collapsibleSectionHeader", function () {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'app/views/order/collapsible-section-view.html',
		controller: 'collapsibleSectionController',
		link: function () {
			// apply JQuery "collapsible" attribute to each element of class "menu-header"
			$(".menu-header").collapsible({
				collapsible: true,
			});
		}
	};
});
