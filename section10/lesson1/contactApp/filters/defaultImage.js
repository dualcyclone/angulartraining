angular.module('contactApp.filters.defaultImage', [])
    .filter('defaultImage', function() {
        return function(input, param) {
            // if no input, return the provided default
            return input || param;
        };
    });