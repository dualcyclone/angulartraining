var app = angular.module('codecraft', []);

app.controller('PersonController', function($scope, $http) {
	$http.get('persons.json')
		.then(function(res){
			$scope.persons = res.data;

			console.log($scope.persons);
		});
});