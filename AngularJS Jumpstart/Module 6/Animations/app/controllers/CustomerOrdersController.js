(function(){
    var app = angular.module('customerApp');

    var CustomerOrdersController = function ($scope, $routeParams, CustomerFactory) {
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

    //CustomerOrdersController.$inject = ['$scope', '$routeParams', 'CustomerFactory'];

    app.controller('CustomerOrdersController', CustomerOrdersController);
}());
