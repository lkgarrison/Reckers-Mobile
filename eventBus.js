var EventBus = angular.module('EventBus', []);

EventBus.factory('EventService', ['$rootScope', function ($rootScope) {
	eventService = {};

	// broadcasts starting at $rootScope and trickling down to all child scopes that subscribe to subscriptionName
	eventService.broadcast = function (subscribeName, data) {
		$rootScope.$broadcast(subscribeName, data);
	};

	return eventService;
}]);