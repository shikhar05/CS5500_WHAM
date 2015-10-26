var express = require('express');
var app = express();


app.get("/privacy", function (req, res) {
    res.sendfile('privacyPolicy.html');
});

app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.get("/", function (req, res) {
    res.sendfile(__dirname + '/public/Hello.html');
});


app.listen(port, ipaddress);