(function(){
    var app = angular.module('customerApp');

    var AllOrdersController = function ($scope, CustomerFactory) {
        $scope.orders = null;
        $scope.ordersTotal = 0;
        $scope.totalType = 'danger';

        function init() {
            CustomerFactory.getOrders()
                .success(function(orders) {
                    $scope.orders = orders;
                    getOrdersTotal();
                })
                .error(function(data, status, headers, config) {
                    $log.log(data.error, status);
                });
        }

        function getOrdersTotal() {
            var total = 0;

            $scope.orders.forEach(function(order) {
                total += order.total;
            });

            $scope.ordersTotal = total;
            $scope.totalType = ($scope.ordersTotal > 100) ? 'success' : 'danger';
        }

        init();
    };

    //CustomerOrdersController.$inject = ['$scope', '$routeParams', 'CustomerFactory'];

    app.controller('AllOrdersController', AllOrdersController);
}());
