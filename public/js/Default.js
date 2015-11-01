
var app = angular.module("wham", ['ngRoute']);

app.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
    when('/home', {
        templateUrl: 'partials/Home.html',
        controller: 'HomeCtrl',
    }).
    otherwise({
        redirectTo: '/home'
    })
}
]);