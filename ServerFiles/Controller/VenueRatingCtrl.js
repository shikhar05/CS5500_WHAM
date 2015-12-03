var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

module.exports = function () {

    var createRating = function (email,venue_id, liked, callback) {
        DBManager.createRating(venue_id, liked, function (resp) {
            if (resp != "error") {
                var ratingObjId = resp._id;
                createRatingForUser(email, ratingObjId, function (ratingsList) {
                    getAllRatingsOfUser(ratingsList, callback);
                });
            }
        });
    };

    var updateRating = function (objectID, venue_id, liked, callback) {
        DBManager.updateRating(objectID, venue_id, liked, callback);
    };

    var createRatingForUser = function (email, ratingObjId, callback) {
        DBManager.createRatingForUser(email, ratingObjId, callback);
    };

    var deleteRatingForUser = function (email, ratingObjId, callback) {
        DBManager.deleteRatingForUser(email, ratingObjId, liked, callback);
    };

    var getRatingById = function (id, callback) {
        DBManager.getRatingById(id, callback);
    };

    var getAllRatings = function (callback) {
        DBManager.getAllRatings(callback);
    };

    var getAllRatingsByVenueObjId = function (venueid, callback) {
        DBManager.getAllRatingsByVenueObjId(venueid, callback);
    };

    var getAllRatingsOfUser = function (venueObjList, callback) {
        var userRatings = [];
        for (var i in venueObjList) {
            var venueObjID = venueObjList[i];
            getAllRatingsByVenueObjId(venueObjID, function (resp) {
                if (resp != 'none' && resp != 'error')
                    userRatings.unshift(resp);
            });
        }
        callback(userRatings);
    };

    return {
        createRating: createRating,
        updateRating: updateRating,
        createRatingForUser: createRatingForUser,
        deleteRatingForUser: deleteRatingForUser,
        getRatingById: getRatingById,
        getAllRatings: getAllRatings,
        getAllRatingsByVenueObjId: getAllRatingsByVenueObjId,
        getAllRatingsOfUser: getAllRatingsOfUser
    }
};