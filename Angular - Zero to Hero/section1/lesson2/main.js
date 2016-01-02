'use strict';

var app = angular.module('Registration', []);

app.controller('RegistrationControl', function($scope) {
    $scope.formModel = {};

    $scope.onSubmit = function() {
        console.log('SUBMIT!',$scope.formModel);
    };
});