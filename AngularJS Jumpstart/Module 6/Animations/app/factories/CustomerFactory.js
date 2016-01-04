(function(){
    var app = angular.module('customerApp');

    // TODO: BE SURE TO RUN THE APP ON THE SAME DOMAIN AND PORT AS THE NODE SERVER PROVIDING THE DATA, OTHERIWSE YOU'LL RUN INTO CROSS-DOMAIN SCRPTIING ISSUES

    var CustomerFactory = function ($http) {
        var factory = {};

        factory.getCustomers = function () {
            return $http.get('http://localhost:8080/customers');
        };

        factory.getCustomer = function (customerId) {
            return $http.get('http://localhost:8080/customers/' + customerId);
        };

        return factory;
    };

    //CustomerFactory.$inject = ['$http'];

    app.factory('CustomerFactory', CustomerFactory);
}());
