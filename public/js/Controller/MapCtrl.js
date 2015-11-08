
app.controller("MapCtrl", function ($scope, MyService, $element) {

    var map, infoWindow;
    var markers = [];

    // map config
    var mapOptions = {
        center: new google.maps.LatLng(50, 2),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true
    };

    $scope.init = function () {
        
        MyService.initUserPosition(function (msg) {
            if (msg == 'ok') {
                var position = MyService.getUserPosition();
                $scope.position = position;

                mapOptions.center = new google.maps.LatLng($scope.position.lat, $scope.position.lon);

                if (map === void 0) {
                    map = new google.maps.Map($element[0], mapOptions);
                    setMarker(map, new google.maps.LatLng($scope.position.lat, $scope.position.lon), 'You are here', 'Just some content');
                    setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
                    setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
                    setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
                }


                MyService.searchEvent();

            }
            else {
                alert(msg);
            }
        })

        
    };


    // place a marker
    function setMarker(map, position, title, content) {
        var marker;
        var markerOptions = {
            position: position,
            map: map,
            title: title,
            icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        };

        if (title == 'You are here') {
            markerOptions.icon = '/img/blue_dot.png';
            content = "You are here";
        }

        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array

        google.maps.event.addListener(marker, 'click', function () {
            // close window if not undefined
            if (infoWindow !== void 0) {
                infoWindow.close();
            }
            // create new window
            var infoWindowOptions = {
                content: content
            };
            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            infoWindow.open(map, marker);
        });
    };

});