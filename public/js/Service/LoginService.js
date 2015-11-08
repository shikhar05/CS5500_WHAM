app.factory("LoginService", function ($http) {

    var currentUserProfile = null;

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

    return {
        getCurrentUSerProfile: getCurrentUSerProfile,
        login: login,
        register: register
    }
});