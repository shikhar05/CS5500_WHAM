
app.controller("MapCtrl", function ($rootScope,$scope, MyService, $element) {
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
        where: "San Diego",
        "date": "2013061000-2015062000",
        page_size: 50,
        sort_order: "popularity",
    };

    $scope.init = function () {

        MyService.initUserPosition(function (msg) {
            if (msg == 'ok') {
                var position = MyService.getUserPosition();
                $scope.position = position;

                //set oArgs location parameter
                oArgs.where = "Boston";

                if (map === void 0) {
                    //create map and center it to the user's location
                    mapOptions.center = new google.maps.LatLng($scope.position.lat, $scope.position.lon);
                    map = new google.maps.Map($element[0], mapOptions);

                    map.addListener('click', function () {

                        if ($rootScope.showSidePanel == undefined) $rootScope.showSidePanel = false;
                        $rootScope.showSidePanel = false;
                        alert($rootScope.showSidePanel);
                        infoWindow.close();
                    });

                    setMarker(map, new google.maps.LatLng($scope.position.lat, $scope.position.lon), 'You are here', 'Just some content');

                    //query
                    EVDB.API.call("/events/search", oArgs, function (data) {
                        
                        for (var d in data.events.event) {
                            var event = data.events.event[d];
                            console.log(event);
                            var info = "";

                            info += '<div class="info-window">' +
                                    '<h4>' + event.title + '</h4>' +
                                    '<p>Venue: ' + event["venue_name"] + ', ' + event["venue_address"] + '</p><br/>' +
                                    '<a href="' + event["venue_url"] + '" target="_blank">' + 'Venue URL' + '</a><br/>' +
                                    '<a href="' + event.url + '" target="_blank">' + 'Event URL' + '</a><br/>' +
                                    '</div>';
                            setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, info);
                        }
                    })
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