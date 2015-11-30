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

    return {
        updatePreference: updatePreference,
        deletePreference: deletePreference
    }
};