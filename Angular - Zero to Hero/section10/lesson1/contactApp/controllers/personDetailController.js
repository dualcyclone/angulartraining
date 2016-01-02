var pd = angular.module('contactApp.controllers.personDetail', []);

pd.controller('PersonDetailController', function($scope, $stateParams, $state, ContactService) {
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
