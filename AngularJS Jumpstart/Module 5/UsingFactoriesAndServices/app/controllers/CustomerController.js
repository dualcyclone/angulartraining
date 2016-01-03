(function(){
    var app = angular.module('customerApp');

    var CustomerController = function ($scope, CustomerFactory) {
        $scope.customerSorting = '';
        $scope.reverse = false;

        $scope.doSort = function(propName) {
            $scope.customerSorting = propName;
            $scope.reverse = !$scope.reverse;
        };

        function init() {
            $scope.customers = CustomerFactory.getCustomers();
        }

        init();
    };

    //CustomerController.$inject = ['$scope', 'CustomerFactory'];

    app.controller('CustomerController', CustomerController);
}());
