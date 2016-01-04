(function(){
    var app = angular.module('customerApp');

    var CustomerController = function ($scope, $log, CustomerFactory, appSettings) {
        $scope.customerSorting = '';
        $scope.reverse = false;
        $scope.customers = [];
        $scope.appSettings = appSettings;

        $scope.doSort = function(propName) {
            $scope.customerSorting = propName;
            $scope.reverse = !$scope.reverse;
        };

        $scope.deleteCustomer = function(customerId) {
            CustomerFactory.deleteCustomer(customerId)
                .success(function(status) {
                    if (status) {
                        for (var i = 0, length = $scope.customers.length; i < length; i += 1) {
                            if ($scope.customers[i].id === customerId) {
                                $scope.customers.splice(i, 1); // delete the specific customer from the client copy
                                break;
                            }
                        }
                    } else {
                        $window.alert('Unable to delete customer!')
                    }
                })
                .error(function(data, status, headers, config) {
                    $log.log(data.error, status);
                })
        };

        function init() {
            CustomerFactory.getCustomers()
                .success(function(customers) {
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
