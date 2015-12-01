
app.controller("InfoBoxCtrl", function ($scope) {

    $scope.getDirections = function (address) {

        var event = $scope.event;

        address += ", " + event["city_name"] + ", " + event["region_name"] + ", " + event["country_name"];
        var lat = event.latitude;
        var lon = event.longitude;

        $scope.$parent.calculateAndDisplayRoute(address,lat,lon);
    };

    
});
