(function(){
    var app = angular.module('directivesModule', []);

    app.directive('helloWorld', function() {
        // Directive Definition Object (DDO)
        return {
            template: 'Hello World'
        };
    });
}());
