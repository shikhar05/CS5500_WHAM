var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

module.exports = function () {

    var updatePreference = function (email, preference, callback) {
        DBManager.updatePreference(email, preference,function (updatedPreferences) {
            if (updatedPreferences) {
                callback(updatedPreferences);
            } else {
                callback(null);
            }
        });
    };

    var deletePreference = function (email, preference, callback) {
        DBManager.deletePreference(email, preference, function (updatedPreferences) {
            if (updatedPreferences) {
                callback(updatedPreferences);
            } else {
                callback(null);
            }
        });
    };

    var changePassword = function (passwordData, callback) {

        var email = passwordData.email;
        var oldPass = passwordData.oldPassword
        var newPass = passwordData.newPassword

        DBManager.changePassword(email, oldPass, newPass, function (msg) {
            callback(msg);
        });
    };

    //*********************************************** Going to Event *******************************************//
    
    var createHistory = function (email, eventId, callback) {
        DBManager.createHistory(email, eventId, callback);
    }

    var deleteHistory = function (email, eventId, callback) {
        DBManager.deleteHistory(email, eventId, callback);
    }

    return {
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword,
        createHistory: createHistory,
        deleteHistory: deleteHistory
    }
};