var app = angular.module('codecraft', [
	'ngResource'
]);

app.config(function($httpProvider, $resourceProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token da4eb42da465bc8d3334f33b4d16fd68d4882885';
	$resourceProvider.defaults.stripTrailingSlashes = false;
});

app.factory('Contact', function($resource) {
    return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/');
});

app.service('ContactService', function(Contact) {
	var self = {
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
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'loadContacts': function() {
            Contact.get(function(data) {
                angular.forEach(data.results, function(person) {
                    self.persons.push(new Contact(person));
                });
            });
        },
        'persons': []
    };

    self.loadContacts();

	return self;
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
