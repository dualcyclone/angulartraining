(function(){
    var app = angular.module('contactsApp');

    app.controller('PersonCreateController', function($scope, $state, ContactService) {
        $scope.mode = "Create";

        $scope.contacts = ContactService;

        $scope.save = function() {
            $scope.contacts.createContact($scope.contacts.selectedPerson).then(function() {
                $state.go('list');
            });
        };
    });
}());
