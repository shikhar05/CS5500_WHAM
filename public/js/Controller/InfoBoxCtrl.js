
app.controller("InfoBoxCtrl", function ($scope, $compile) {


    $scope.init = function () {
        if ($scope.event.description) {
            $scope.event.description = $scope.event.description.replace(/<\/?[^>]+(>|$)/g, "");

            if ($scope.event.description.length > 350) {
                $scope.event.description = $scope.event.description.substring(0,350)+"..."
            }
        }
    };

    $scope.getDirections = function (address) {

        var event = $scope.event;

        address += ", " + event["city_name"] + ", " + event["region_name"] + ", " + event["country_name"];
        var lat = event.latitude;
        var lon = event.longitude;

        $scope.$parent.calculateAndDisplayRoute(address, lat, lon);
    };


});
