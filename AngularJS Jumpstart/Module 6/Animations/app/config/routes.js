(function(){
    var app = angular.module('customerApp');

    app.config(function($routeProvider) {
       $routeProvider
           .when('/',  {
                controller: 'CustomerController',
                templateUrl: 'app/views/customer.html'
           })
           .when('/orders',  {
               controller: 'AllOrdersController',
               templateUrl: 'app/views/allOrders.html'
           })
           .when('/orders/:customerId',  {
               controller: 'CustomerOrdersController',
               templateUrl: 'app/views/customerOrders.html'
           })
           .otherwise({
               redirectTo: '/'
           })
    });
}());
