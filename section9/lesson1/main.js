var app = angular.module('codecraft', [
	'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate',
    'ui.router'
]);

// configure routing
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('list', {
            url: '/',
            views: {
                'main' : {
                    templateUrl: 'templates/list.html',
                    controller: 'PersonListController'
                },
                'filter': {
                    templateUrl: 'templates/filterForm.html',
                    controller: 'PersonListController'
                }
            }
        })
        .state('edit', {
            url: '/edit/:id',
            views: {
                'main': {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonDetailController'
                }
            }
        })
        .state('create', {
            url: '/create',
            views: {
                'main': {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonCreateController'
                }
            }
        });

    $urlRouterProvider.otherwise('/');
});

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

// Custom directive for the spinner, use <cc-spinner></cc-spinner> in the HTML to use it (Angular auto converts the camelCase reference to hyphenated-reference for use in the HTML)
app.directive('ccSpinner', function() {
    return {
        /*
            Restrict tells the directive in what ways it can be used:
            A - Attribute (eg: <div cc-spinner></div> (by default))
            E - Element (eg <cc-spinner></cc-spinner> (by default))
            C - Class (eg <div class="cc-spinner"></div> (off by default, need to use this to enable))
            ... otherwise, configuring this, you can restrict to any of these combinations, eg:
            A, E, C, AE (default anyway), CE, AC, AEC, etc...
         */
        restrict: 'E',
        templateUrl: 'templates/spinner.html',

        // isolating the scope from the scope that may exist outside of the directive (http://onehungrymind.com/angularjs-sticky-notes-pt-2-isolated-scope/)
        scope: {
            isLoading: '=', // defines a two-way binding, so changing the isLoading value within this scope will change it with the value that has been linked to it also
            message: '@' // passes through a direct value, which is resolved before it gets to this - so this is a direct simple variable assignment
        }

    };
});

app.directive('ccCard', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/card.html',
        scope: {
            user: '='
        },
        controller: function($scope, ContactService) {
            $scope.isDeleting = false;
            $scope.deleteUser = function() {
                $scope.isDeleting = true;
                ContactService.deleteContact($scope.user).then(function() {
                    $scope.isDeleting = false;
                });
            }
        }
    };
});

app.filter('defaultImage', function() {
    return function(input, param) {
        // if no input, return the provided default
        return input || param;
    };
});

app.service('ContactService', function(Contact, $rootScope, $q, toaster) {
	var self = {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'getPerson': function(id) {
            return self.persons.find(function(person) {
                return +person.id === +id; // convert string to number so that these always match correctly
            });
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
        'sorting': '',
        'reset': function() {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
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

            var deferred = $q.defer();

            person.$update().then(function() {
                self.isUpdating = false;

                toaster.pop('success', 'Updated ' + person.name);

                deferred.resolve();
            });

            return deferred.promise;
        },
        'deleteContact': function(person) {
            self.isDeleting = true;

            var deferred = $q.defer();

            person.$remove().then(function() {
                self.isDeleting = false;

                var i = self.persons.indexOf(person);

                self.persons.splice(i, 1);

                self.selectedPerson = null;

                toaster.pop('success', 'Deleted ' + person.name);

                deferred.resolve();
            });

            return deferred.promise;
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

    // Add watchers
    $rootScope.$watch(function() {
        return self.search;
    }, function(value) {
        if (angular.isDefined(value)) {
            self.reset();
        }
    });
    $rootScope.$watch(function() {
        return self.sorting;
    }, function(value) {
        if (angular.isDefined(value)) {
            self.reset();
        }
    });

	return self;
});

app.controller('PersonListController', function($scope, $modal, ContactService) {
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

    $scope.deletePerson = function(person) {
        $scope.contacts.deleteContact(person);
    };
});

app.controller('PersonDetailController', function($scope, $stateParams, $state, ContactService) {
    $scope.mode = "Edit";

	$scope.contacts = ContactService;

    var returnToList = function() {
        $state.go('list');
    };

    $scope.contacts.selectedPerson = $scope.contacts.getPerson($stateParams.id) || null;

    $scope.save = function() {
        $scope.contacts.updateContact($scope.contacts.selectedPerson).then(returnToList);
    };
});

app.controller('PersonCreateController', function($scope, $state, ContactService) {
    $scope.mode = "Create";

    $scope.contacts = ContactService;

    $scope.save = function() {
        $scope.contacts.createContact($scope.contacts.selectedPerson).then(function() {
            $state.go('list');
        });
    };
});
