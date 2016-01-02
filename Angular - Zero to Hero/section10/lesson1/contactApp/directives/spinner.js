angular.module('contactApp.directives.spinner', [])
    .directive('ccSpinner', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/spinner.html',
            scope: {
                isLoading: '=',
                message: '@'
            }

        };
    });