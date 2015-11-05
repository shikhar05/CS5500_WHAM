var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());   //for parsing application/json

app.use(multer()); // for parsing multipart/form-data

app.use(session({
    secret: process.env.SESSION_SECRET || 'this is the secret',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


app.get("/privacy", function (req, res) {
    res.sendfile('privacyPolicy.html');
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ipaddress);

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendfile(__dirname + '/public/Default.html');
});

/******************************************** ~~ DATABASE SCHEMAS ~~ ********************************************/

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/wham');

var UserProfileSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    referalCode: String,
    rewardPoints: Number
}, { collection: "UserProfile" });

var UserProfileModel = mongoose.model("UserProfileModel", UserProfileSchema)

var C_rewardPoints = 50;

/*************************************************** ~~ Register ~~***********************************************/

app.post("/register", function (req, res) {

    var newUser = req.body;

    UserProfileModel.findOne({ email: newUser.email }, function (err, user) {

        if (err) { res.send("error"); }
        else if (user) {
            res.send("User already exists");
        } else {


            var rand = Math.floor((Math.random() * 100) + 54);
            var referalCode = newUser.email.split('@')[0] + rand;

            var newUserProfile = {
                'firstname': newUser.firstname,
                'lastname': newUser.lastname,
                'email': newUser.email,
                'password': newUser.password,
                'referalCode': referalCode,
                'rewardPoints': C_rewardPoints
            };
            var newUserProfileObject = new UserProfileModel(newUserProfile);

            newUserProfileObject.save(function (err, userProfile) {

                if (err) { res.send("error"); }

                res.send("ok");

            });
        }
    });
});

/*************************************************** ~~ Login ~~***********************************************/

passport.use('Authentication', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, done) {
        UserProfileModel.findOne({ email: email, password: password }, function (err, user) {
            if (err) {
                res.send("Error");
            }
            if (user != null) {
                var userProfile = {
                    'firstname': user.firstname,
                    'lastname': user.lastname,
                    'email': user.email,
                    'referalCode': user.referalCode,
                    'rewardPoints': user.rewardPoints
                };
                return done(null, userProfile);
            } else {
                return done(null, false, { message: 'Unable to login' });
            }
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/login", passport.authenticate('Authentication'), function (req, res) {

    var user = req.user;

    res.json(user);

});
