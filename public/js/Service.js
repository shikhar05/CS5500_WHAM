
app.factory("MyService", function ($http) {

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

    return {
        initUserPosition: initUserPosition,
        getUserPosition: getUserPosition
    }

});