var path = require('path');
var mongoose = require('mongoose');

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/wham');

var UserProfile = require(path.resolve("./ServerFiles/DAO/UserProfileDAO.js"))(mongoose);
var VenueRating = require(path.resolve("./ServerFiles/DAO/VenueRatingDAO.js"))(mongoose);

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
        UserProfile.updatePreference(email, preference, callback);
    };

    var deletePreference = function (email, preference, callback) {
        UserProfile.deletePreference(email, preference, callback);
    };

    var changePassword = function (email, oldPass, newPass, callback) {
        UserProfile.changePassword(email, oldPass, newPass, callback);
    };

    //*********************************************** Going to Event *******************************************//
    
    var createHistory = function (email, eventId,callback) {
        UserProfile.createHistory(email, eventId, callback);
    }

    var deleteHistory = function (email, eventId, callback) {
        UserProfile.deleteHistory(email, eventId, callback);
    };

    //*********************************************** Rating *******************************************//

    var createRating = function (venue_id, liked, callback) {
        VenueRating.create(venue_id, liked, callback);
    };

    var updateRating = function (objectID, venue_id, liked, callback) {
        VenueRating.update(objectID, venue_id, liked, callback);
    };

    var createRatingForUser = function (email, ratingObjId, callback) {
        UserProfile.createRating(email, ratingObjId, callback);
    };

    var deleteRatingForUser = function (email, ratingObjId, callback) {
        UserProfile.deleteRating(email, ratingObjId, callback);
    };

    var getRatingById = function (id, callback) {
        VenueRating.getRatingById(id,callback);
    };

    var getAllRatings = function (callback) {
        VenueRating.getAllRatings(callback);
    };

    var getAllRatingsByVenueObjId = function (venueid, callback) {
        VenueRating.getAllRatingsByVenueObjId(venueid, callback);
    };

    return {
        createUserProfile: createUserProfile,
        findUserProfileByEmail: findUserProfileByEmail,
        findUserProfileByEmailPassword: findUserProfileByEmailPassword,
        updateRewardPoints: updateRewardPoints,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword,
        createHistory: createHistory,
        deleteHistory: deleteHistory,
        createRating: createRating,
        updateRating: updateRating,
        createRatingForUser: createRatingForUser,
        deleteRatingForUser: deleteRatingForUser,
        getRatingById: getRatingById,
        getAllRatings: getAllRatings,
        getAllRatingsByVenueObjId: getAllRatingsByVenueObjId
    };

}

