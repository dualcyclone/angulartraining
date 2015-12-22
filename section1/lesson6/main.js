'use strict';

var app = angular.module('Registration', [
	'jcs-autoValidate' // Adding dependency: angular-auto-validate
]);

// Adding additional error messages to make the form validation messages user friendly
app.run(function(defaultErrorMessageResolver){
	defaultErrorMessageResolver.getErrorMessages()
		.then(function(errorMessages) {
			errorMessages['tooYoung'] = 'You need to be at least {0} years of age';
			errorMessages['tooOld'] = 'You need to be no more than {0} years of age';
			errorMessages['badUsername'] = 'Your username must be between 7 and 15 characters, and only contain letters (upper or lower case), numbers and underscore';
		})
});

app.controller('RegistrationControl', function($scope, $http) {
	$scope.formModel = {};

	$scope.onSubmit = function() {
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