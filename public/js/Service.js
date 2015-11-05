app.factory("MyService", function ($http) {
    //Google Maps
    var position ={lat:null,lon:null}
    var initUserPosition = function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                position.lat = pos.coords.latitude;
                position.lon = pos.coords.longitude;
                callback('ok');
            });
        } else {
            callback('Geolocation is not supported by this browser.');
        }
    };
    var getUserPosition = function () {
        return position;
    };

    //Event search
    var searchEvent = function () {
        $http.jsonp("http://api.eventful.com/json/events/search?id=k6C5qrCrdBgZMSkw&keywords=books&location=San+Diego&date=Future")
        .success(function (resp) {

            console.log(resp);

        });
    }
    var events = [];
    var addToList = function (event) {
        events.push(event);
    }
    var getEvents = function () {
        return events;
    }

    //Return block
    return {
        searchEvent: searchEvent,
        addToList: addToList,
        getEvents: getEvents,
        initUserPosition: initUserPosition,
        getUserPosition: getUserPosition
    }
});