app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.directive('myMap', function () {
    return {
        restrict: 'E',
        template: '<div> \
                        <div id="tutorial" class="tutorial"> \
                            <div id="tutorial-welcome"> \
                                <h1>Welcome to Whats Happening Around Me!</h1> \
                                <p>(Click anywhere to close this)</p> \
                            </div> \
                            <div id="tutorial-filter" class="tutorial-box"> \
                                <h3>Filter & Search</h3> \
                                <p>(Click here to open/close side panel)</p> \
                            </div> \
                            <div id="tutorial-login" class="tutorial-box"> \
                                <h3>Login</h3> \
                                <p>(Click here to login to the system and to view user option after login)</p> \
                            </div> \
                            <div id="tutorial-route"> \
                                <div class="arrow-down"></div> \
                                <h3>Route from your location</h3> \
                                <p>(Click on "Get directions" to get the destination address here. Click on "X" to remove the route displayed)</p> \
                            </div> \
                        </div> \
                        <div class="gmaps" ng-controller="MapCtrl" ng-init="init()"></div> \
                    </div>',
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


app.directive('infoBox', function () {
    return {
        restrict: 'E',
        templateUrl: '/partials/InfoBox.html',
        replace: true
    };
});

