(function(){
    // When referencing our module via angular, we do not need to inject any dependencies, hence the lack of [].
    var app = angular.module('customerApp');

    // Defining our controller
    var CustomerController = function ($scope) {
        $scope.customerSorting = '';
        $scope.reverse = false;

        $scope.customers= [
            {
                id: 1,
                joined: '2000-12-02',
                name:'John',
                city:'Chandler',
                orderTotal: 9.9956,
                orders: [
                    {
                        id: 1,
                        product: 'Shoes',
                        total: 9.9956
                    }
                ]
            },
            {
                id: 2,
                joined: '1965-01-25',
                name:'Zed',
                city:'Las Vegas',
                orderTotal: 19.99,
                orders: [
                    {
                        id: 2,
                        product: 'Baseball',
                        total: 9.995
                    },
                    {
                        id: 3,
                        product: 'Bat',
                        total: 9.995
                    }
                ]
            },
            {
                id: 3,
                joined: '1944-06-15',
                name:'Tina',
                city:'New York',
                orderTotal:44.99,
                orders: [
                    {
                        id: 4,
                        product: 'Headphones',
                        total: 44.99
                    }
                ]
            },
            {
                id: 4,
                joined: '1995-03-28',
                name:'Dave',
                city:'Seattle',
                orderTotal:101.50,
                orders: [
                    {
                        id: 5,
                        product: 'Kindle',
                        total: 101.50
                    }
                ]
            }
        ];

        $scope.doSort = function(propName) {
            $scope.customerSorting = propName;
            $scope.reverse = !$scope.reverse;
        };
    };

    // if using minification, using this assignment will fix the dependency injection when the argument names are minified
    //CustomerController.$inject = ['$scope']; // needs to be in the exact same order as the actual function arguments

    // Hook the controller to the controller reference in the app
    app.controller('CustomerController', CustomerController);
}());
