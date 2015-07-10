var EventBus = angular.module('EventBus', []);

EventBus.factory('EventService', ['$rootScope', function ($rootScope) {
	eventService = {};

	eventService.broadcast = function (subscribeName, data) {
		console.log("about to broadcast");
		$rootScope.$broadcast(subscribeName, data);
	};

	return eventService;
}]);