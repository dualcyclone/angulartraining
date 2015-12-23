var app = angular.module('codecraft', []);

app.controller('PersonController', function($scope, $http) {
	$http.get('persons.json')
		.then(function(res){
			$scope.persons = res.data;
		});

	var searchPersistence = '',// Search query text persistence, to check for changes between searches to aid subset persistence
		filteredPersons = []; // Persistence of found persons based on the query text. Initialised as empty, but angular will populate this immediate on load

	$scope.search = ''; // initialise the search value
	$scope.selectedPerson = null; // initialise the selected person data of the row (currently none selected)
	$scope.sorting = ''; // initialise as no predefined order - this will also map to the "Select order" option in the form

	$scope.selectPerson = function() {
		var selectedPerson = this.person,
			isSameAsSelected = ($scope.selectedPerson !== selectedPerson);

		// If the selected person is the same as the one already selected, de-select it, otherwise persist the person data
		$scope.selectedPerson = isSameAsSelected ? selectedPerson : null;
	};

	// helper to find if the selected person exists in the filtered subset
	$scope.selectedPersonExists = function() {
		return filteredPersons.indexOf($scope.selectedPerson) > -1;
	};

	// Custom filter for filtering a set of data
	$scope.sensitiveSearch = function(person, index) {
		var search = $scope.search,

			// If there is a query, perform the real filter; otherwise always return true to prevent any filtering of each person
			found = (search !== '' ? (person.name.indexOf(search) === 0 || person.email.indexOf(search) === 0) : true);

		// If the new search term isn't the same as the old search term, clear the persisted filtered persons subset
		if (search !== searchPersistence) {
			filteredPersons = [];
		}

		// If this person matches the search query, and the person doesn't already exist in the subset, push them into the filtered persons subset
		if (found && filteredPersons.indexOf(person) === -1) {
			filteredPersons.push(person);
		}

		// Persist the search term (regardless of whether it has changed or not)
		searchPersistence = search;

		// If the selected person no longer exists within the filtered persons subset, reset the selected person
		if (index === $scope.persons.length-1 && filteredPersons.indexOf($scope.selectedPerson) === -1) {
			$scope.selectedPerson = null;
		}

		return found;
	};

	$scope.sortBy = function(sorting) {
		// If the sort selected is already selected, reset the sort to it's original order
		$scope.sorting = ($scope.sorting === sorting ? '' : sorting);
	};
});