app.factory("MyService", function ($http) {

    var currentUserProfile = null;

    //Google Maps
    var position = { lat: null, lon: null }
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


    var register = function (newUser, callback) {
        $http.post("/register", newUser)
        .success(function (res) {
            if (res == 'User already exists') {
                callback("Username aready exists");
            } else if (res == 'error') {
                callback("Some Error occured in Server");
            }
            else if (res == 'ok') {
                $http.post("/login", newUser)
                    .success(function (res) {

                        currentUserProfile = res.user;

                        callback(currentUserProfile);
                    });
            }
        });
    };


    var login = function (user, callback) {
        $http.post("/login", user)
       .success(function (res) {
           console.log("Service");
           console.log(res);
           currentUserProfile = res;
          
           callback('ok');
       })
        .error(function (err) {
            callback('error');
        });
    };

    var getCurrentUSerProfile = function () {
        return currentUserProfile;
    }

    //Return block
    return {
        searchEvent: searchEvent,
        addToList: addToList,
        getEvents: getEvents,
        initUserPosition: initUserPosition,
        getUserPosition: getUserPosition,

        //*********************Login*********************
        login: login,
        getCurrentUSerProfile:getCurrentUSerProfile,
        //*********************Register*********************
        register: register
    }
});