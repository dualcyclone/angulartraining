var app = angular.module('contactApp', [
    'contactApp.filters',
    'contactApp.services',
    'contactApp.directives',
    'contactApp.controllers',

	'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate',
    'ui.router'
]);

// configure routing
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('list', {
            url: '/',
            views: {
                'main' : {
                    templateUrl: 'templates/list.html',
                    controller: 'PersonListController'
                },
                'filter': {
                    templateUrl: 'templates/filterForm.html',
                    controller: 'PersonListController'
                }
            }
        })
        .state('edit', {
            url: '/edit/:id',
            views: {
                'main': {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonDetailController'
                }
            }
        })
        .state('create', {
            url: '/create',
            views: {
                'main': {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonCreateController'
                }
            }
        });

    $urlRouterProvider.otherwise('/');
});

app.config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token da4eb42da465bc8d3334f33b4d16fd68d4882885';
	$resourceProvider.defaults.stripTrailingSlashes = false;

    laddaProvider.setOption({
        style: 'expand-right'
    });

    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'd/M/yyyy',
        autoclose: true
    });
});

app.factory('Contact', function($resource) {
    return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/', {
        id:'@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
});


