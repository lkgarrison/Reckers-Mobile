var appConfig = angular.module('appConfig', []);

appConfig.service('configService', [function () {
	/* Enter the food types (exactly as they appear on Parse) in the order you would like them to be displayed in the collapsible set, from top to bottom
	 * TODO: Any food types omitted will not be displayed
	*/
	collapsibleSetOrder = ['pizza','piadina','americanFare','salad','breakfast','side','smoothie'];

	this.getCollapsibleSetOrder = function () {
		return collapsibleSetOrder;
	};
}]);