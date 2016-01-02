var app = angular.module('codecraft', []);

app.service('ContactService', function($http, $q) {
	var deffered = $q.defer(),
		service = {
			'addPerson': function (person) {
				this.persons.push(person);
			},
			'selectedPerson': null,
			'selectPerson': function(person) {
				var selectedPerson = person,
					isSameAsSelected = (service.selectedPerson !== selectedPerson);

				// If the selected person is the same as the one already selected, de-select it, otherwise persist the person data
				service.selectedPerson = isSameAsSelected ? selectedPerson : null;
			},
			'persons': []
		};

	service.async = function() {
		$http.get('persons.json')
			.then(function(res){
				service.persons = res.data;
				deffered.resolve();
			});
		return deffered.promise;
	};

	return service;
});

// Proper custom filter for searching
app.filter('sensitiveSearch', function() {
	return function(persons, search) {
		return persons.filter(function(person) {
			// If there is a query, perform the real filter; otherwise always return true to prevent any filtering of each person
			return (search !== '' ? (person.name.indexOf(search) === 0 || person.email.indexOf(search) === 0) : true);
		});
	};
});

app.controller('PersonListController', function($scope, $filter, ContactService) {
	$scope.search = ''; // initialise the search value
	$scope.sorting = ''; // initialise as no predefined order - this will also map to the "Select order" option in the form
	$scope.contacts = ContactService;

	ContactService.async(); // collect the persons data

	// helper to find if the selected person exists in the filtered subset
	$scope.selectedPersonExists = function() {
		return $scope.filteredPersons.indexOf($scope.selectedPerson) > -1;
	};

	$scope.sortBy = function(sorting) {
		// If the sort selected is already selected, reset the sort to it's original order
		$scope.sorting = ($scope.sorting === sorting ? '' : sorting);
	};

	$scope.filterPersons = function() {
		var filtered = $filter('sensitiveSearch')($filter('orderBy')($scope.contacts.persons, $scope.sorting), $scope.search); // $scope.persons is undefined on initial load... http get to slow?

		// If the selected person no longer exists within the filtered persons subset, reset the selected person
		if (filtered.indexOf($scope.contacts.selectedPerson) === -1) {
			$scope.contacts.selectedPerson = null;
		}

		return filtered;
	};
});

app.controller('PersonDetailController', function($scope, ContactService) {
	$scope.contacts = ContactService;
});
