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
});