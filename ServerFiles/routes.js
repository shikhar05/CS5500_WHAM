
var path = require('path');

var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

var LoginCtrl = require(path.resolve('./ServerFiles/Controller/LoginCtrl.js'))();

var ProfileCtrl = require(path.resolve('./ServerFiles/Controller/ProfileCtrl.js'))();

module.exports = function (app, passport, LocalStrategy) {

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        LoginCtrl.login(email, password, done);
    }));

    passport.serializeUser(function (user, done) {
        console.log("in serialize");
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log("in deserialize");
        console.log(user);
        DBManager.findUserProfileById(user._id, function (user) {
            done(null, user);
        });
    });

    app.get("/privacy", function (req, res) {
        res.sendfile(path.resolve('privacyPolicy.html'));
    });

    app.get("/", function (req, res) {

        var cwd = process.cwd();
        var indexFile = cwd + "/public/Default.html";
        res.sendfile(indexFile);
        //res.sendfile(path.resolve(__dirname+'./public/Default.html'));
    });

    // Get User
    app.get("/api/user/email=:email", function (req, res) {
        LoginCtrl.checkIfUserExist(req.params.email, function (responce) {
            res.send(responce);
        });
    });

    // Post User
    app.post("/api/user", function (req, res) {

        LoginCtrl.register(req.body, function (responce) {
            res.send(responce);
        });

    });

    // Login
    app.post("/login", passport.authenticate('local'), function (req, res) {

        var user = req.user;
        delete user.password;
        res.json(user);
    });

    app.post("/logout", function (req, res) {
        LoginCtrl.logout(req.body,req, function (responce) {
            res.send(responce);
        });
    });

    app.get("/rest/api/loggedin", function (req, res) {
        console.log("in api")
        console.log(req.user);
        console.log(req.isAuthenticated());
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post("/api/user/password", function (req, res) {

        ProfileCtrl.changePassword(req.body, function (responce) {
            res.send(responce);
        });

    });

    app.post("/api/user/preference", function (req, res) {
        var email = req.body.email;
        var preference = req.body.preference;
        ProfileCtrl.updatePreference(email, preference, function (responce) {
            res.send(responce);
        });
    });

    app.post("/api/user/preference/delete", function (req, res) {

        var email = req.body.email;
        var preference = req.body.preference;
        ProfileCtrl.deletePreference(email, preference, function (responce) {
            res.send(responce);
        });
    });

    //*********************************************** Going to Event *******************************************//

    app.post("/api/user/history", function (req, res) {
        var email = req.body.email;
        var data = req.body.data;
        ProfileCtrl.createHistory(email, data, function (responce) {
            res.send(responce);
        });
    });

    app.post("/api/user/history/delete", function (req, res) {
        var email = req.body.email;
        var data = req.body.data;
        ProfileCtrl.deleteHistory(email, data, function (responce) {
            res.send(responce);
        });
    });

    //*********************************************** Rating *******************************************//

    app.post("/api/venue/rate", function (req, res) {

        var email = req.body.email;
        var data = req.body.data;

        ProfileCtrl.createRating(email, data, function (responce) {
            res.send(responce);
        });
    });


    app.get("/api/venue/rate/count", function (req, res) {
        ProfileCtrl.getRatingCount(function (responce) {
            res.send(responce);
        });
    });

    app.get("/api/forgot/email=:email", function (req, res) {
        var email = req.params.email;
        LoginCtrl.forgot(email, function (responce) {
            res.send(responce);
        });
    })


    //*********************************************** Clear DB *******************************************//
    app.get("/admin/cleardb", function (req, res) {
        DBManager.clearDB(function (responce) {
            res.write(responce);
        });
    })

};

