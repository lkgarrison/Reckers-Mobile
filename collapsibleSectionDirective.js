app.directive("collapsibleSectionHeader", function () {
	return {
		restrict: 'E',
		scope: {
			section: '='
		},
		templateUrl: 'collapsibleSectionDirective.html',
		link: function () {
			// apply JQuery "collapsible" attribute to each element of class "menuHeader"
			$(".menuHeader").collapsible({
				collapsible: true,
			});
		}
	};
});
