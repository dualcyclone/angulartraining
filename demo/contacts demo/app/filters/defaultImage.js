(function(){
    var app = angular.module('contactsApp');

    app.filter('defaultImage', function() {
        return function(input, param) {
            // if no input, return the provided default
            return input || param;
        };
    });
}());
