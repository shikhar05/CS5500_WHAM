var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();
var VenueRating = require(path.resolve("./ServerFiles/Controller/VenueRatingCtrl.js"))();
var querystring = require('querystring');
var http = require('http');
var C_rewardPoints = 50;

module.exports = function () {

    var checkIfUserExist = function (email, callback) {
        DBManager.findUserProfileByEmail(email, function (user) {
            if (user) {
                callback("ok");
            } else {
                callback(null);
            }
        });
    };

    var register = function (newUser, callback) {

        DBManager.findUserProfileByEmail(newUser.email, function (user) {
            if (user) {
                callback("User already exists");
            } else {

                var rand = Math.floor((Math.random() * 100) + 54);
                var referalCode = newUser.email.split('@')[0] + rand;

                var newUserProfile = {
                    'firstname': newUser.first,
                    'lastname': newUser.last,
                    'email': newUser.email,
                    'password': newUser.password,
                    'referalCode': referalCode,
                    'rewardPoints': C_rewardPoints
                };
                DBManager.createUserProfile(newUserProfile, function (resp) {
                    if (resp == 'error') { callback("error"); }
                    else { callback("ok"); }
                });

                if (newUser.referal != null) {
                    DBManager.updateRewardPoints(newUser.referal);
                }
            }
        });
    };

    var login = function (email, password, done) {
        DBManager.findUserProfileByEmailPassword(email, password, function (resp) {
            if (resp == 'error') { }
            else {
                user = resp;
                if (user != null) {
                    console.log("user table ratings")
                    console.log(resp.ratings);
                    VenueRating.getAllRatingsOfUser(resp.ratings, function (userRatings) {
                        user.ratings = userRatings;
                        return done(null, user);
                    });
                } else {
                    return done(null, false, { message: 'Unable to login' });
                }
            }
        });
    };

    var forgot = function (email, callback) {
        console.log("Email: " + email);
        //'prashanth.malladi92@gmail.com'
        DBManager.findUserProfileByEmail(email, function (user) {
            console.log("User: " + user);
            if (user) {
                sendMail(email, user.password, callback);
            }
        });
    }

    var logout = function (reqUser, callback) {
        DBManager.findUserProfileByEmail(reqUser.email, function (err, user) {
            if (user != null) {
                req.session.destroy();
                callback(200);
            }
            else {
                callback("Error");
            }
        })
    };

    var addReferalPoints = function (referalcode) {

    };

    return {
        register: register,
        login: login,
        checkIfUserExist: checkIfUserExist,
        forgot: forgot,
        logout: logout
    };

};

function sendMail(email, password, callback) {
    var data = querystring.stringify({
        'key': 'mqrBDV3wlPgp-Y57HqsP8w',
        'message': {
            'from_email': 'npcompete.wham@gmail.com',
            'to': [
                {
                    'email': email,
                    'name': 'Prashanth',
                    'type': 'to'
                }
            ],
            'autotext': 'true',
            'subject': 'WHAM password',
            'html': password
        }
    });
    http.request({
        method: 'POST',
        host: 'https://mandrillapp.com/api/1.0/messages/send.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    }, function (response) {
        console.log(responce);
        callback(response);
    });
}

//var smtpTransport = nodemailer.createTransport("SMTP", {
//    service: "Gmail",
//    auth: {
//        user: "*****************",  //hidden content
//        pass: "*****************"  //hidden content
//    }
//});

//if (userProfile != null) {
//    if (userProfile.verified == true) {

//        mailOptions = {
//            to: userProfile.email,
//            subject: "Do Not Reply : Password Recovery",
//            html: "Hello,<br> <br> Username: " + username + "<br>Password: " + user.password
//        }
//        smtpTransport.sendMail(mailOptions, function (error, response) {
//            if (error) {
//                res.send("error");
//            } else {
//                res.send("Password sent to your Email!!");
//            }
//        });
//    }
//    else {
//        res.send("Email is not verified");
//    }
//}