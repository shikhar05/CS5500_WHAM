var path = require('path');

var LoginCtrl = require(path.resolve('./ServerFiles/Controller/LoginCtrl.js'))();

module.exports = function (app, passport, LocalStrategy) {

    passport.use('Authentication', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (email, password, done) {
        LoginCtrl.login(email, password, done);
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
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


    app.post("/register", function (req, res) {

        LoginCtrl.register(req.body, function (responce) {
            res.send(responce);
        });

    });

    app.post("/login", passport.authenticate('Authentication'), function (req, res) {

        var user = req.user;

        res.json(user);

    });

};