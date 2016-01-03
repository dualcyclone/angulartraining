(function(){
    var app = angular.module('customerApp');

    var CustomerController = function ($scope, $log, CustomerFactory, appSettings) {
        $scope.customerSorting = '';
        $scope.reverse = false;
        $scope.customers = false;
        $scope.appSettings = appSettings;

        $scope.doSort = function(propName) {
            $scope.customerSorting = propName;
            $scope.reverse = !$scope.reverse;
        };

        function init() {
            CustomerFactory.getCustomers()
                .success(function(customers) {
                    console.log(customers)
                    $scope.customers = customers;
                })
                .error(function(data, status, headers, config) {
                    $log.log(data.error, status);
                });
        }

        init();
    };

    //CustomerController.$inject = ['$scope', '$log', 'CustomerFactory', 'appSettings'];

    app.controller('CustomerController', CustomerController);
}());
