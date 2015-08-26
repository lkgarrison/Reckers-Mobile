var materialBackButtonModule = angular.module('materialBackButton', []);

materialBackButtonModule.directive("materialBackButton", function () {
	return {
		restrict: 'E',
		templateUrl: 'app/directives/material-back-button-view.html'
	};
});