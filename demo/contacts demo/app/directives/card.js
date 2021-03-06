(function(){
    var app = angular.module('contactsApp');

    app.directive('ccCard', function() {
        return {
            restrict: 'AE',
            templateUrl: 'app/templates/card.html',
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
}());
