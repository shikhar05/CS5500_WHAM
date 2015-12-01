
app.controller("MapCtrl", function ($rootScope, $scope, MyService, $element, $compile) {
    var map, infoWindow;
    var markers = [];

    $scope.loading = true;

    $scope.directionsTo;

    var spinner, directionsBox;



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

    var oArgs = {
        app_key: "k6C5qrCrdBgZMSkw",
        category: "",
        where: "",
        date: "",
        page_size: 50,
        within: 10
    };

    $scope.init = function () {

        MyService.initUserPosition(function (msg) {
            if (msg == 'ok') {

                var position = MyService.getUserPosition();
                $scope.position = position;

                //set oArgs location parameter
                oArgs.where = $scope.position.lat + "," + $scope.position.lon;

                //if map exists, print on map
                printOnMap(oArgs);
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
            animation: google.maps.Animation.DROP,
            title: title,
            icon: '/img/red-dot.png'
        };

        if (title == 'You are here') {
            markerOptions.icon = '/img/blue_dot.png';
            content = "You are here";
        }

        marker = new google.maps.Marker(markerOptions);
        markers.push(marker); // add marker to array

        if (content == 'You are here') {
            if (infoWindow !== void 0) {
                infoWindow.close();
            }
            // create new window
            var infoWindowOptions = {
                content: content
            };
            infoWindow = new google.maps.InfoWindow(infoWindowOptions);
            infoWindow.open(map, marker);

            setTimeout(function () {
                infoWindow.close();
            }, 4000);

        };

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

        //google.maps.event.addListener(marker, 'mouseover', function () {
        //    // close window if not undefined
        //    if (infoWindow !== void 0) {
        //        infoWindow.close();
        //    }
        //    // create new window
        //    var infoWindowOptions = {
        //        content: content
        //    };
        //    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        //    infoWindow.open(map, marker);
        //});

        //google.maps.event.addListener(marker, 'mouseout', function () {
        //    // close window if not undefined
        //    if (infoWindow !== void 0) {
        //        infoWindow.close();
        //    }
        //    // create new window
        //    var infoWindowOptions = {
        //        content: content
        //    };
        //    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
        //    infoWindow.close(map, marker);
        //});
    };


    $scope.$watch(function () {
        return MyService.getFilter();
    },
    function (filter) {
        $scope.loading = true;
        $scope.filter = filter;
        printOnMap(oArgs);
    },
    true);

    function printOnMap(oArgs) {
        if (map === void 0) {
            //create map and center it to the scope.position's location
            mapOptions.center = new google.maps.LatLng($scope.position.lat, $scope.position.lon);
            map = new google.maps.Map($element[0], mapOptions);
        }

        //setting defaults
        var date = new Date();
        currentMonth = date.getMonth();
        currentDate = date.getDate();
        if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
        if (currentDate < 10) { currentDate = '0' + currentDate; }
        oArgs.date = "" + date.getFullYear() + currentMonth + currentDate + '00-' + date.getFullYear() + currentMonth + currentDate + '00';
        oArgs.category = "";

        //check for filters applied
        if (filterAppliedType() || filterAppliedFromDate() || filterAppliedToDate()) {
            if (filterAppliedType()) oArgs.category = $scope.filter.type;
            if (filterAppliedFromDate() && !filterAppliedToDate()) oArgs.date = "" + $scope.filter.fromDate + "00-" + $scope.filter.fromDate + "00";
            if (!filterAppliedFromDate() && filterAppliedToDate()) oArgs.date = "" + date + "00-" + $scope.filter.toDate + "00";
            if (filterAppliedFromDate() && filterAppliedToDate()) oArgs.date = "" + $scope.filter.fromDate + "00-" + $scope.filter.toDate + "00";

        }

        deleteMarkers();

        setMarker(map, new google.maps.LatLng($scope.position.lat, $scope.position.lon), 'You are here', '');

        //api call

        //query
        EVDB.API.call("/events/search", oArgs, function (data) {
            for (var d in data.events.event) {

                var event = data.events.event[d];
                var scope = $scope.$new();
                scope.event = event;
                console.log(event.title);
                console.log(event);

                var compiled = $compile("<div><info-box></info-box></div>")(scope);
                setMarker(map, new google.maps.LatLng(event.latitude, event.longitude), event.name, compiled[0]);
            }
            $scope.loading = false;
        });

        if (spinner == undefined) {
            spinner = angular.element("<center><img src='../img/gps.gif' ng-show='loading' id='spinner'></center>");
            $element.append(spinner);
            $compile(spinner)($scope);
        }

        if (directionsBox == undefined) {
            var html = "<div class='directionBox'>\
                            <input type='text' ng-model='directionsTo' disabled/> \
                            <input type='button' value='X' ng-click='clearDirection()'/> \
                        </div>"
            directionsBox = angular.element(html);
            $compile(directionsBox)($scope);
            $element.append(directionsBox);
        }
    }

    function filterAppliedType() {
        if ($scope.filter != null) {
            if ($scope.filter.type == null || $scope.filter.type == '') return false;
            else return true;
        }
        return false;
    }
    function filterAppliedFromDate() {
        if ($scope.filter != null) {
            if ($scope.filter.fromDate == null || $scope.filter.fromDate == '') return false;
            else return true;
        }
        return false;
    }
    function filterAppliedToDate() {
        if ($scope.filter != null) {
            if ($scope.filter.toDate == null || $scope.filter.toDate == '') return false;
            else return true;
        }
        return false;
    }

    function deleteMarkers() {
        setMapOnAll(null);
        markers = [];
    }
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    var directionsService;
    var directionsDisplay;

    $scope.clearDirection = function () {
        if (directionsDisplay) {
            $scope.directionsTo = null;
            directionsDisplay.setMap(null);
        }
    };

    $scope.calculateAndDisplayRoute = function (toAdd, lat, lon) {

        if (directionsDisplay) {
            directionsDisplay.setMap(null);
        }

        directionsService = new google.maps.DirectionsService;

        directionsDisplay = new google.maps.DirectionsRenderer({
            'map': map,
            'preserveViewport': true,
            'draggable': true
        });


        $scope.directionsTo = toAdd;

        directionsService.route({
            origin: $scope.position.lat + "," + $scope.position.lon,
            destination: lat + "," + lon,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            console.log(status);
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
});

