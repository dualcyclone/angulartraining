var pl = angular.module('contactApp.controllers.personList', []);

pl.controller('PersonListController', function($scope, $modal, ContactService) {
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
