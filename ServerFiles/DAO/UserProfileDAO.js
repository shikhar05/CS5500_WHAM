
module.exports = function (mongoose) {

    var C_rewardPoints = 50;

    var UserProfileSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        referalCode: String,
        rewardPoints: Number
    }, { collection: "UserProfile" });

    UserProfileModel = mongoose.model("UserProfileModel", UserProfileSchema)


    var create = function (newUserProfile, callback) {

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
                callback(userFound);
            }
        });
    };

    return {
        create: create,
        findByEmail: findByEmail,
        findByEmailPassword: findByEmailPassword
    }

};
