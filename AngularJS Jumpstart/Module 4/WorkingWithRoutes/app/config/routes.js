(function(){
    var app = angular.module('customerApp');

    app.config(function($routeProvider) {
       $routeProvider
           .when('/',  {
                controller: 'CustomerController',
                templateUrl: 'app/views/customer.html'
           })
           .when('/orders/:customerId',  {
               controller: 'OrdersController',
               templateUrl: 'app/views/orders.html'
           })
           .otherwise({
               redirectTo: '/'
           })
    });
}());
