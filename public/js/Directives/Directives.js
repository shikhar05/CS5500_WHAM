
app.directive('myMap', function () {
    return {
        restrict: 'E',
        template: '<div class="gmaps" ng-controller="MapCtrl" ng-init="init()"></div>',
        replace: true
    };
});


app.directive('sidePanel', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/SidePanel.html',
        replace: true
    };
});

