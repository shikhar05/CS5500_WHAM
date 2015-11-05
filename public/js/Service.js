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
    var searchEvent = function (title, callback) {
        $http.jsonp("http://api.eventful.com/rest/events/search?...&keywords=books&location=San+Diego&date=Future")
        .success(callback);
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
        search: searchEvent,
        addToList: addToList,
        getEvents: getEvents,
        initUserPosition: initUserPosition,
        getUserPosition: getUserPosition
    }
});