var app = angular.module('codecraft', [
	'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate'
]);

app.config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token da4eb42da465bc8d3334f33b4d16fd68d4882885';
	$resourceProvider.defaults.stripTrailingSlashes = false;

    laddaProvider.setOption({
        style: 'expand-right'
    });

    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'd/M/yyyy',
        autoclose: true
    });
});

app.factory('Contact', function($resource) {
    return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/', {
        id:'@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
});

app.filter('defaultImage', function() {
    return function(input, param) {
        // if no input, return the provided default
        return input || param;
    };
});

app.service('ContactService', function(Contact, $q, toaster) {
	var self = {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'selectedPerson': null,
        'selectPerson': function(person) {
            var selectedPerson = person,
                isSameAsSelected = (self.selectedPerson !== selectedPerson);

            // If the selected person is the same as the one already selected, de-select it, otherwise persist the person data
            self.selectedPerson = isSameAsSelected ? selectedPerson : null;
        },
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'isUpdating': false,
        'isDeleting': false,
        'search': '',
        'soerting': '',
        'doSearch': function(search) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.search = search;
            self.loadContacts();
        },
        'doSorting': function(sorting) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.sorting = sorting;
            self.loadContacts();
        },
        'loadContacts': function() {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    'page': self.page,
                    'search': self.search,
                    'ordering': self.sorting
                }

                Contact.get(params, function(data) {
                    angular.forEach(data.results, function (person) {
                        self.persons.push(new Contact(person));
                    });

                    if (!data.next) {
                        self.hasMore = false;
                    }

                    self.isLoading = false;
                });
            }
        },
        'loadMore': function() {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadContacts();
            }
        },
        'updateContact': function(person) {
            self.isUpdating = true;
            person.$update().then(function() {
                self.isUpdating = false;
                toaster.pop('success', 'Updated ' + person.name);
            });
        },
        'deleteContact': function(person) {
            self.isDeleting = true;
            person.$remove().then(function() {
                self.isDeleting = false;

                var i = self.persons.indexOf(person);

                self.persons.splice(i, 1);

                self.selectedPerson = null;

                toaster.pop('success', 'Deleted ' + person.name);
            });
        },
        'createContact': function(person) {
            var deferred = $q.defer();

            self.isUpdating = true;
            Contact.save(person).$promise.then(function() {
                self.isUpdating = false;
                self.selectedPerson = null;
                self.hasMore = true;
                self.page = 1;
                self.persons = [];
                self.loadContacts();

                toaster.pop('success', 'Created ' + person.name);

                deferred.resolve();
            });

            return deferred.promise;
        },
        'persons': []
    };

    self.loadContacts();

	return self;
});

app.controller('PersonListController', function($scope, $filter, ContactService, $modal) {
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

    $scope.loadMore = function() {
        $scope.contacts.loadMore();
    };

    $scope.$watch('search', function(value, oldValue) {
        if (angular.isDefined(value) && (value !== oldValue)) {
            $scope.contacts.doSearch(value);
        }
    });

    $scope.$watch('sorting', function(value, oldValue) {
        if (angular.isDefined(value) && (value !== oldValue)) {
            $scope.contacts.doSorting(value);
        }
    });

    $scope.showCreateModal = function() {
        $scope.contacts.selectedPerson = null;
        $scope.createModal = $modal({
            scope: $scope,
            template: 'templates/modal.create.tpl.html',
            show: true
        });
    };

    $scope.createContact = function() {
        $scope.contacts.createContact($scope.contacts.selectedPerson).then(function() {
            $scope.createModal.hide();
        });
    };
});

app.controller('PersonDetailController', function($scope, ContactService) {
	$scope.contacts = ContactService;

    $scope.save = function() {
        $scope.contacts.updateContact($scope.contacts.selectedPerson);
    };

    $scope.delete = function() {
        $scope.contacts.deleteContact($scope.contacts.selectedPerson);
    };
});
