'use strict';

var app = angular.module('Registration', []);

app.controller('RegistrationControl', function($scope, $http) {
	$scope.formModel = {};

	$scope.onSubmit = function() {
		var regForm = $scope.registrationForm;

		if (!regForm.$valid) {
			console.log('the form was invalid; rejecting...');

			return;
		}

		console.log('SUBMIT!',$scope.formModel);

		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel)
			.success(function(data) {
				console.log('Success...',data);
			})
			.error(function(data) {
				// to get this to error with the above endpoint, the name needs to be "error" :-/
				console.log('Error...',data);
			});
	};
});