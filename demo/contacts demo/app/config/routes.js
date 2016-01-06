(function(){
    var app = angular.module('contactsApp');

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('list', {
                url: '/',
                views: {
                    'main' : {
                        templateUrl: 'app/views/list.html',
                        controller: 'PersonListController'
                    },
                    'filter': {
                        templateUrl: 'app/templates/filterForm.html',
                        controller: 'PersonListController'
                    }
                }
            })
            .state('edit', {
                url: '/edit/:id',
                views: {
                    'main': {
                        templateUrl: 'app/views/edit.html',
                        controller: 'PersonDetailController'
                    }
                }
            })
            .state('create', {
                url: '/create',
                views: {
                    'main': {
                        templateUrl: 'app/views/edit.html',
                        controller: 'PersonCreateController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    });
}());
