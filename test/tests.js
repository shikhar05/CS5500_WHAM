
// describe('#indexOf()', function () {
//   it('should return -1 when the value is not present', function () {
//     chai.assert.equal(-1, [1, 2, 3].indexOf(5));
//   chai.assert.equal(-1, [1, 2, 3].indexOf(0));
//});
//});
// process.env.NODE_ENV = 'test';
var path = require('path');
var chai = require('chai');
var chaiHttp = require('chai-http');
var UserModule = require('../ServerFiles/DAO/DatabaseManager');
var should = chai.should();
var expect = require('expect.js');
var mongoose = require('mongoose');
chai.use(chaiHttp);


describe('Get User Info Test Suite', function () {
    it('Should retrieve user info based on his email', function () {

        var email = 'singh.mo@husky.neu.edu';
        chai.request(UserModule)
            .get('/findUserProfileByEmail/' + email)
            .end(function (err, res) {

                expect(err).to.eql(null);
                res.should.have.status(200);
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
                res.body.email.should.equal('singh.mo@husky.neu.edu');
                done();
            });
    });
});

/**
 * Created by Sandeep on 12/1/2015.
 */
//process.env.NODE_ENV = 'test';






// it('Should display an error if there is no account registered with that email', function (done) {

// var email = 'luckaaay005@gmail.com';
// chai.request(UserModule)
//   .get('/getUserInfo/' + email)
//  .end(function (err, res) {
//      expect(err).to.eql(null);
//      res.text.should.equal('error');
//      done();
//  });
// });



