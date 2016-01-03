(function(){
    var app = angular.module('customerApp');

    var OrdersController = function ($scope, $routeParams, CustomerFactory) {
        var customerId = +$routeParams.customerId;

        $scope.customer = undefined;

        function init() {
            $scope.customer = CustomerFactory.getCustomer(customerId);
        }
        init();
    };

    //OrdersController.$inject = ['$scope', '$routeParams', 'CustomerFactory'];

    app.controller('OrdersController', OrdersController);
}());
