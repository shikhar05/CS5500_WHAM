
app.directive('myMap', function () {
    return {
        restrict: 'E',
        template: '<div class="gmaps" ng-controller="MapCtrl" ng-init="init()"></div>',
        replace: true
    };
});

