app.factory("LoginService", function ($http) {

    var currentUserProfile = null;

    var checkIfUserExist = function (email, callback) {
        $http.get("/api/user/email=" + email)
                .success(function (res) {
                    if (res == "error") {
                        callback("error");
                    } else if (res == '') {
                        callback(null);
                    } else {
                        callback("ok");
                    }
                });
    };

    var register = function (newUser, callback) {
        $http.post("/api/user", newUser)
        .success(function (res) {
            if (res == 'User already exists') {
                callback("Username aready exists");
            } else if (res == 'error') {
                callback("Some Error occured in Server");
            }
            else if (res == 'ok') {
                $http.post("/login", newUser)
                    .success(function (res) {
                        currentUserProfile = res;
                        callback('ok');
                    });
            }
        });
    };

    var login = function (user, callback) {
        $http.post("/login", user)
       .success(function (res) {
           currentUserProfile = res;
           callback('ok');
       })
        .error(function (err) {
            callback('error');
        });
    };

    var getCurrentUSerProfile = function () {
        return currentUserProfile;
    };

    return {
        getCurrentUSerProfile: getCurrentUSerProfile,
        login: login,
        register: register,
        checkIfUserExist: checkIfUserExist
    }
});