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
        preferences: {}
    }, { collection: "UserProfile" });

    UserProfileModel = mongoose.model("UserProfileModel", UserProfileSchema)

    var create = function (newUserProfile, callback) {
        newUserProfile.preferences = { "0": [], "1": [], "2": [], "3": [] }
        console.log(newUserProfile);
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
                        userFound.preferences[index][i].keywords += " " + keywords
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


    return {
        create: create,
        findById: findById,
        findByEmail: findByEmail,
        findByEmailPassword: findByEmailPassword,
        updateRewardPoints: updateRewardPoints,
        updatePreference: updatePreference,
        deletePreference: deletePreference
    }
};
