var path = require('path');
var mongoose = require('mongoose');

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/wham');

var UserProfile = require(path.resolve("./ServerFiles/DAO/UserProfileDAO.js"))(mongoose);

module.exports = function () {

    var createUserProfile = function (newUserProfile, callback) {
        UserProfile.create(newUserProfile, callback);
    };

    var findUserProfileByEmail = function (email, callback) {
        UserProfile.findByEmail(email, callback);
    };

    var findUserProfileByEmailPassword = function (email, password, callback) {
        UserProfile.findByEmailPassword(email, password, callback);
    };

    return {
        createUserProfile: createUserProfile,
        findUserProfileByEmail: findUserProfileByEmail,
        findUserProfileByEmailPassword: findUserProfileByEmailPassword
    };

}

