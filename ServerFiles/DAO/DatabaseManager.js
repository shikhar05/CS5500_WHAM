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

    var findUserProfileById = function (id, callback) {
        UserProfile.findById(id, callback);
    };

    var findUserProfileByEmailPassword = function (email, password, callback) {
        UserProfile.findByEmailPassword(email, password, callback);
    };

    var updateRewardPoints = function (referalCode) {
        UserProfile.updateRewardPoints(referalCode);
    };

    var updatePreference = function (email, preference, callback) {
        console.log(email + preference);
        UserProfile.updatePreference(email,preference, callback);
    };

    var deletePreference = function (email, preference, callback) {
        UserProfile.deletePreference(email, preference, callback);
    };

    var changePassword = function (email, oldPass, newPass,callback) {
        UserProfile.changePassword(email, oldPass, newPass, callback);
    };

    return {
        createUserProfile: createUserProfile,
        findUserProfileByEmail: findUserProfileByEmail,
        findUserProfileByEmailPassword: findUserProfileByEmailPassword,
        updateRewardPoints: updateRewardPoints,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword
    };

}

