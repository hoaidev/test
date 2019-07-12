const User = require('../models/userModel');
var authConfig = require('./auth');
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var session = require('express-session');
var commonFunction = require('./../common/commonFunction');
var commonMessage = require('./../common/commonMessage');
module.exports = (router, passport) => {
    router.use(passport.initialize());
    router.use(passport.session());
    router.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('facebookToken', new FacebookTokenStrategy({
        clientID: authConfig.facebookAuth.clientID,
        clientSecret: authConfig.facebookAuth.clientSecret
    },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ 'fbId': profile._json.id }).exec((err, user) => {
                if (err) done(err);
                if (user) {
                    user.role === 2 ? done(null, user) : done(null, {})
                } else {
                    var newUser = new User;
                    newUser.fbId = profile._json.id;
                    newUser.name = profile._json.name;
                    newUser.role = 1;
                    newUser.avatar = profile.photos[0].value;
                    //slug
                    newUser.insertTime = commonFunction.getCurrTimestampInSecNum();

                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    })
                }
            });
        }
    ));

    return passport;
}