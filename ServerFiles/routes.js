var path = require('path');
var DBManager = require(path.resolve("./ServerFiles/DAO/DatabaseManager.js"))();

var LoginCtrl = require(path.resolve('./ServerFiles/Controller/LoginCtrl.js'))();

module.exports = function (app, passport, LocalStrategy) {

    passport.use('Authentication', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        LoginCtrl.login(email, password, done);
    }));

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        DBManager.findUserProfileById(id, function () {
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
    app.post("/login", passport.authenticate('Authentication'), function (req, res) {

        var user = req.user;
        delete user._id;
        delete user.password;
        res.json(user);

    });

    app.post("/logout", function (req, res) {
        LoginCtrl.logout(req.body, function (responce) {
            res.send(responce);
        });
    });
};