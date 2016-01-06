(function(){
    var app = angular.module('contactsApp');

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
}());
