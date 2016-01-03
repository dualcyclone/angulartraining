(function(){
    var app = angular.module('customerApp');

    // Not available in app.config
    app.value('appSettings',  {
        title: 'Customers Application',
        version: '1.0.0'
    });

    // Available in app.config
    //app.constant('appSettings',  {
    //    title: 'Customers Application',
    //    version: '1.0.0'
    //});
}());
