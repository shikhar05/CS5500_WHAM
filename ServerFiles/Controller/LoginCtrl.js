var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

var C_rewardPoints = 50;

module.exports = function () {

    var register = function (newUser, callback) {

        DBManager.findUserProfileByEmail(newUser.email, function (user) {
            if (user) {
                callback.send("User already exists");
            } else {

                var rand = Math.floor((Math.random() * 100) + 54);
                var referalCode = newUser.email.split('@')[0] + rand;

                var newUserProfile = {
                    'firstname': newUser.firstname,
                    'lastname': newUser.lastname,
                    'email': newUser.email,
                    'password': newUser.password,
                    'referalCode': referalCode,
                    'rewardPoints': C_rewardPoints
                };

                DBManager.createUserProfile(newUserProfile, function (err, userProfile) {

                    if (err) { callback("error"); }

                    callback("ok");
                });
            }
        });
    };

    var login = function (email, password, done) {
        DBManager.findUserProfileByEmailPassword(email, password, function (resp) {
            if (resp == 'error') { }
            else {
                user = resp;
                if (user != null) {
                    var userProfile = {
                        'firstname': user.firstname,
                        'lastname': user.lastname,
                        'email': user.email,
                        'referalCode': user.referalCode,
                        'rewardPoints': user.rewardPoints
                    };
                    return done(null, userProfile);
                } else {
                    return done(null, false, { message: 'Unable to login' });
                }
            }
        });
    };

    var test = function () {
        console.log("jhv");
    };

    return {
        register: register,
        login: login,
        test: test
    };

};