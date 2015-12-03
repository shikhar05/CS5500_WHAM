var C_rewardPoints = 50;

module.exports = function (mongoose) {

    var C_rewardPoints = 50;

    var p = new mongoose.Schema({
        type: String,
        keywords: String
    })

    var Pref = new mongoose.Schema({
        index: Number,
        value: mongoose.Schema.Types.Mixed
    });

    var UserProfileSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        referalCode: String,
        rewardPoints: Number,
        preferences: {},
        history: [],
        ratings:[]
    }, { collection: "UserProfile" });

    UserProfileModel = mongoose.model("UserProfileModel", UserProfileSchema)

    var create = function (newUserProfile, callback) {
        newUserProfile.preferences = { "0": [], "1": [], "2": [], "3": [] }
        newUserProfile.history = [];
        newUserProfile.ratings = [];
        var newUserProfileObject = new UserProfileModel(newUserProfile);

        newUserProfileObject.save(function (err, savedUserProfileResponce) {
            if (err) {
                callback("error");
            }
            else {
                callback("ok");
            }
        });
    };

    var findById = function (id, callback) {
        UserProfileModel.findOne({ _id: id }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                callback(userFound);
            }
        });
    };

    var findByEmail = function (email, callback) {
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                callback(userFound);
            }
        });
    };

    var findByEmailPassword = function (email, password, callback) {
        UserProfileModel.findOne({ email: email, password: password }, function (err, userFound) {
            if (err) {
                callback("error");
            }
            else {
                console.log(userFound);
                callback(userFound);
            }
        });
    };

    var updateRewardPoints = function (referalCode) {
        UserProfileModel.findOne({ referalCode: referalCode }, function (err, userFound) {
            if (err) {
                //callback('error');
            }
            else {

                userFound.rewardPoints += C_rewardPoints;
                userFound.save(function (err, user) {
                    if (err) {
                        //callback('error');
                    } else {
                        //callback('ok');
                    }
                });
            }
        });
    };

    var updatePreference = function (email, preference, callback) {
        console.log("pref start " + preference);
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback('error');
            }
            else if (userFound) {

                var index = preference.of.toString();
                var type = preference.type;
                var keywords = preference.keywords;

                updated = false;
                console.log(index);
                for (var i in userFound.preferences[index]) {
                    if (userFound.preferences[index][i].type == type) {
                        //userFound.preferences[index][i].keywords += " " + keywords
                        userFound.preferences[index][i].keywords = keywords;
                        removeDuplicates(userFound.preferences[index][i].keywords);
                        updated = true;
                    }
                }
                if (!updated) {
                    userFound.preferences[index].push({ 'type': type, 'keywords': keywords });
                    updated = true;
                }
                console.log("after update");
                console.log(userFound.preferences);
                if (updated) {
                    userFound.markModified('preferences');
                }

                userFound.save(function (err, user) {
                    console.log("error");
                    console.log(err);

                    if (err) {
                        callback('error');
                    } else {
                        callback(userFound.preferences);
                    }

                });
            }
        });
    }

    var deletePreference = function (email, preference, callback) {
        UserProfileModel.findOne({ email: email }, function (err, userFound) {
            if (err) {
                callback('error');
            }
            else if (userFound) {
                console.log("delete dao");
                console.log(preference);
                var index = preference.of.toString();
                var type = preference.type;
                var keywords = preference.keywords;

                updated = false;
                console.log(index);
                for (var i in userFound.preferences[index]) {
                    if (userFound.preferences[index][i].type == type) {
                        userFound.preferences[index].splice(i, 1);
                        updated = true;
                    }
                }

                console.log("after update");
                console.log(userFound.preferences);
                if (updated) {
                    userFound.markModified('preferences');
                }

                userFound.save(function (err, user) {
                    console.log("error");
                    console.log(err);

                    if (err) {
                        callback('error');
                    } else {
                        callback(userFound.preferences);
                    }

                });
            }
        });
    }

    var removeDuplicates = function (text) {
        var a = [];
        var arr = text.split(" ");
        for (i = 0; i < arr.length; i++) {
            var current = arr[i];
            if (a.indexOf(current) < 0) a.push(current);
        }
        return a.join(" ");
    }

    var changePassword = function (email, oldPass, newPass, callback) {
        UserProfileModel.findOne({ email: email, password: oldPass }, function (err, user) {
            if (user) {
                user.password = newPass;

                user.save(function (err, user) {
                    if (err) {
                        callback('db error');
                    } else {
                        callback("ok");
                    }

                });

            } else {
                callback("errror")
            }
        })
    }

    //*********************************************** Going to Event *******************************************//
    
    var createHistory = function (email, eventId, callback) {
        console.log(email + " " + eventId);
        UserProfileModel.findOne({ email: email}, function (err, user) {
            if (user) {

                if (!(user.history.indexOf(eventId) > -1)) {
                    user.history.push(eventId);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.history);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    var deleteHistory = function (email, eventId, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {
                var index = user.history.indexOf(eventId);

                if (index > -1) {
                    user.history.splice(index,1);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.history);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    //*********************************************** Rating *******************************************//

    var createRating = function (email, ratingObjId, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {
                console.log(!(user.ratings.indexOf(ratingObjId) > -1));

                if (!(user.ratings.indexOf(ratingObjId) > -1)) {
                    user.ratings.push(ratingObjId);
                    console.log("pushed");
                    console.log(user.ratings);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        console.log("saved");
                        console.log(savedUser.ratings);
                        callback(savedUser.ratings);
                    }
                });
            } else {
                callback("error")
            }
        });
    };

    var deleteRating = function (email, ratingObjId, callback) {
        UserProfileModel.findOne({ email: email }, function (err, user) {
            if (user) {
                var index = user.history.indexOf(ratingObjId);

                if (index > -1) {
                    user.ratings.splice(index, 1);
                }

                user.save(function (err, savedUser) {
                    if (err) {
                        callback('error');
                    } else {
                        callback(savedUser.ratings);
                    }
                });
            } else {
                callback("error")
            }
        })
    };

    return {
        create: create,
        findById: findById,
        findByEmail: findByEmail,
        findByEmailPassword: findByEmailPassword,
        updateRewardPoints: updateRewardPoints,
        updatePreference: updatePreference,
        deletePreference: deletePreference,
        changePassword: changePassword,
        createHistory: createHistory,
        deleteHistory: deleteHistory,
        createRating: createRating,
        deleteRating: deleteRating
    }
};
