
module.exports = function (mongoose) {

    var VenueRatingSchema = new mongoose.Schema({
        venue_id: String,
        liked: Boolean
    }, { collection: "VenueRating" });

    VenueRatingModel = mongoose.model("VenueRatingModel", VenueRatingSchema)

    var create = function (venue_id, liked, callback) {

        var newVenueRating = {
            venue_id: venue_id,
            liked: liked
        };

        var venueRatingObject = new VenueRatingModel(newVenueRating);

        venueRatingObject.save(function (err, savedVenueRating) {
            if (err) {
                callback("error");
            }
            else {
                callback(savedVenueRating);
            }
        });
    };

    var update = function (objectID, venue_id, liked, callback) {

        VenueRatingModel.findOne({ _id: objectID, venue_id: venue_id }, function (err, ratingFound) {
            if (err) {
                //callback('error');
            }
            else {
                if (ratingFound.liked == liked) {
                    // Delete
                    VenueRatingModel.find({ _id: objectID }).remove(callback("deleted "+objectID));
                }
                else {
                    //Update
                    ratingFound.liked = liked;
                    ratingFound.save(function (err, savedVenueRating) {
                        if (err) {
                            callback('error');
                        } else {
                            callback("updated");
                        }
                    });
                }
            }
        });
    };

    var getRatingById = function (id,callback) {
        VenueRatingModel.findOne({ _id: id}, function (err, ratingFound) {
            if (err) {
                callback('error');
            }
            else {
                if (ratingFound) {
                    callback(ratingFound);
                } else {
                    callback("none");
                }
            }
        });
    };

    var getAllRatings = function (callback) {
        VenueRatingModel.find({ }, function (err, ratingsFound) {
            if (err) {
                callback('error');
            }
            else {
                if (ratingsFound) {
                    callback(ratingsFound);
                } else {
                    callback("none");
                }
            }
        });
    };

    var getAllRatingsByVenueObjId = function (venueid, callback) {
        VenueRatingModel.find({_id:venueid}, function (err, ratingsFound) {
            if (err) {
                callback('error');
            }
            else {
                if (ratingsFound) {
                    callback(ratingsFound);
                } else {
                    callback("none");
                }
            }
        });
    };

    return {
        create: create,
        update: update,
        getRatingById: getRatingById,
        getAllRatings: getAllRatings,
        getAllRatingsByVenueObjId: getAllRatingsByVenueObjId
    }
};