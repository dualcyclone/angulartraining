(function(){
    var app = angular.module('contactsApp');

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
                    };

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
}());
