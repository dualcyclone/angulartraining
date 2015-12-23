var app = angular.module('codecraft', []);

// Proper custom filter for searching
app.filter('sensitiveSearch', function() {
	return function(persons, search) {
		return persons.filter(function(person) {
			// If there is a query, perform the real filter; otherwise always return true to prevent any filtering of each person
			return (search !== '' ? (person.name.indexOf(search) === 0 || person.email.indexOf(search) === 0) : true);
		});
	};
});

app.controller('PersonListController', function($scope, $rootScope, $http, $filter) {
	$http.get('persons.json')
		.then(function(res){
			$scope.persons = res.data;
		});

	$scope.search = ''; // initialise the search value
	$rootScope.selectedPerson = null; // initialise the selected person data of the row (currently none selected)
	$scope.sorting = ''; // initialise as no predefined order - this will also map to the "Select order" option in the form

	$scope.selectPerson = function() {
		var selectedPerson = this.person,
			isSameAsSelected = ($rootScope.selectedPerson !== selectedPerson);

		// If the selected person is the same as the one already selected, de-select it, otherwise persist the person data
		$rootScope.selectedPerson = isSameAsSelected ? selectedPerson : null;
	};

	// helper to find if the selected person exists in the filtered subset
	$scope.selectedPersonExists = function() {
		return $scope.filteredPersons.indexOf($rootScope.selectedPerson) > -1;
	};

	$scope.sortBy = function(sorting) {
		// If the sort selected is already selected, reset the sort to it's original order
		$scope.sorting = ($scope.sorting === sorting ? '' : sorting);
	};

	$scope.filterPersons = function() {
		var filtered = $scope.persons ? $filter('sensitiveSearch')($filter('orderBy')($scope.persons, $scope.sorting), $scope.search) : []; // $scope.persons is undefined on initial load... http get to slow?

		// If the selected person no longer exists within the filtered persons subset, reset the selected person
		if (filtered.indexOf($rootScope.selectedPerson) === -1) {
			$rootScope.selectedPerson = null;
		}

		return filtered;
	};
});

app.controller('PersonDetailController', function($scope) {

});