(function(){
    var app = angular.module('contactsApp');

    app.factory('Contact', function($resource) {
        return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/', {
            id:'@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });
}());
