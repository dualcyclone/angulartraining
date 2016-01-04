(function(){
    var app = angular.module('customerApp');

    var OrdersController = function ($scope, $routeParams, CustomerFactory) {
        var customerId = +$routeParams.customerId;

        $scope.customer = undefined;

        function init() {
            CustomerFactory.getCustomer(customerId)
                .success(function(customer) {
                    $scope.customer = customer;
                })
                .error(function(data, status, headers, config) {
                    $log.log(data.error, status);
                });
        }
        init();
    };

    //OrdersController.$inject = ['$scope', '$routeParams', 'CustomerFactory'];

    app.controller('OrdersController', OrdersController);
}());
