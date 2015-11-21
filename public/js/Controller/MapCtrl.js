
app.controller("MapCtrl", function ($rootScope, $scope, MyService, $element, $compile) {
    var map, infoWindow;
    var markers = [];
    // map config
    var mapOptions = {
        center: new google.maps.LatLng(50, 2),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        }
    };

    //
    var oArgs = {
        app_key: "k6C5qrCrdBgZMSkw",
        q: "music",
        where: "Boston",
        "date": "2013061000-2015062000",
        page_size: 50,
        within: 10,
        sort_order: "popularity",
    };

    $scope.init = function () {

        MyService.initUserPosition(function (msg) {
            if (msg == 'ok') {
                var position = MyService.getUserPosition();
                $scope.position = position;

                //set oArgs location parameter
                oArgs.where = $scope.position.lat + "," + $scope.position.lon;

                if (map === void 0) {
                    //create map and center it to the user's location
                    mapOptions.center = new google.maps.LatLng($scope.position.lat, $scope.position.lon);
                    map = new google.maps.Map($element[0], mapOptions);

                    map.addListener('click', function () {

                        if ($rootScope.showSidePanel == undefined) $rootScope.showSidePanel = false;
                        $rootScope.showSidePanel = false;
                        infoWindow.close();
                    });

                    setMarker(map, new google.maps.LatLng($scope.position.lat, $scope.position.lon), 'You are here', 'Just some content');

                   
                    //query
                    EVDB.API.call("/events/search", oArgs, function (data) {

                        for (var d in data.events.event) {
                            var event = data.events.event[d];
                            $scope.event = event;
                            var compiled = $compile("<div><info-box></info-box></div>")($scope);
                            setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, compiled[0]);
                        }
                    });
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
            icon: '/img/red-dot.png'
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