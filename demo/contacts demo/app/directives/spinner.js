(function(){
    var app = angular.module('contactsApp');

    app.directive('ccSpinner', function() {
        return {
            /*
             Restrict tells the directive in what ways it can be used:
             A - Attribute (eg: <div cc-spinner></div> (by default))
             E - Element (eg <cc-spinner></cc-spinner> (by default))
             C - Class (eg <div class="cc-spinner"></div> (off by default, need to use this to enable))
             ... otherwise, configuring this, you can restrict to any of these combinations, eg:
             A, E, C, AE (default anyway), CE, AC, AEC, etc...
             */
            restrict: 'E',
            templateUrl: 'app/templates/spinner.html',

            // isolating the scope from the scope that may exist outside of the directive (http://onehungrymind.com/angularjs-sticky-notes-pt-2-isolated-scope/)
            scope: {
                isLoading: '=', // defines a two-way binding, so changing the isLoading value within this scope will change it with the value that has been linked to it also
                message: '@' // passes through a direct value, which is resolved before it gets to this - so this is a direct simple variable assignment
            }

        };
    });
}());
