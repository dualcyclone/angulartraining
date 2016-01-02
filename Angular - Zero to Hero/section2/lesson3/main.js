var app = angular.module('codecraft', []);

app.controller('PersonController', function($scope, $http) {
	$http.get('persons.json')
		.then(function(res){
			$scope.persons = res.data;
		});

	$scope.selectedIndex = -1; // initialise the selected index of the row (currently none selected)
	$scope.selectedPerson = null; // initialise the selected person data of the row (currently none selected)
	$scope.selectPerson = function() {
		var selectedPerson = this.person,
			index = this.$index,
			isSameAsSelected = ($scope.selectedIndex !== index);

		// If the selected index is not the same as what we have just clicked, set the selected index; if it is the same, reset it
		$scope.selectedIndex = isSameAsSelected ? index : -1;

		// If the selected person is the same as the one already selected, de-select it, otherwise persist the person data
		$scope.selectedPerson = isSameAsSelected ? selectedPerson : null;
	}
});