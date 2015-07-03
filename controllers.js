var app = angular.module('app', []);

app.controller("myController", function ($scope) {
	var collapsibleSectionLabels = ['Pizzas', 'Piadinas', 'American Fare', 'Salads', 'Breakfast', 'Sides', 'Smoothies'];
	var collapsibleSectionIds = ['pizzas', 'piadinas', 'americanFare', 'salads', 'breakfast', 'sides', 'smoothies'];
	$scope.collapsibleSectionData = collapsibleSectionLabels.map(function (value, index) {
		return {
			label: value,
			id: collapsibleSectionIds[index]
		};
	});

	// save months and years for credit card expiration dates
	$scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];
	
	$scope.years = [];
	var currentYear = new Date().getFullYear();
	var nYears = 10;
	for(var i = 0; i < nYears; i++) {
		$scope.years.push(currentYear + i);
	}
});