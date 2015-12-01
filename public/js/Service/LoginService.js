app.factory("LoginService", function ($http,$location) {

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

    var logout = function () {
        $http.post("/logout", currentUserProfile)
      .success(function (res) {
          currentUserProfile = null;
          $location.url("/");
      })
       .error(function (err) {
           
       });
    };

    var updatePreference = function (preference) {
        var data = {'email':currentUserProfile.email,'preference':preference}
        $http.post("/api/user/preference", data)
       .success(function (res) {
           currentUserProfile.preferences = res;
           callback(res);
       })
        .error(function (err) {
            callback('error');
        });
    }

    var deletePreference = function (preference) {
        var data = { 'email': currentUserProfile.email, 'preference': preference }
        $http.post("/api/user/preference/delete", data)
       .success(function (res) {
           currentUserProfile.preferences = res;
           callback(res);
       })
        .error(function (err) {
            callback('error');
        });
    };

    var changePassword = function (passData, callback) {

        var data = {
            email: currentUserProfile.email,
            oldPassword: passData.oldPassword,
            newPassword: passData.newPassword
        };

        $http.post("/api/user/password", data)
        .success(function (res) {
            callback(res);
        })
        .error(function (err) {
            
        })
    };

    return {
        getCurrentUSerProfile: getCurrentUSerProfile,
        login: login,
        logout:logout,
        register: register,
        checkIfUserExist: checkIfUserExist,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword
    }
});