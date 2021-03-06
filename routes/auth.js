var express = require('express');
var router = express.Router();
var Note = require('../models/note.js').Note

var passport = require('passport');//passport模块专门处理登录
var GitHubStrategy = require('passport-github').Strategy;
var qqStrategy = require('passport-qq').Strategy;

/* GET auth */

passport.serializeUser(function(user, done) {
    console.log('---serializeUser---')
    console.log(user)
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log('---deserializeUser---')
    console.log(obj)
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: 'f1d9549ce4812e7be470',
        clientSecret: 'efdc1f131202fe30aa56b1eb04b64caef1a2526b',
        callbackURL: "http://47.91.156.35:5000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));//github认证



// passport.use(new qqStrategy({
//         clientID: client_id,
//         clientSecret: client_secret,
//         callbackURL: "http://127.0.0.1:3000/auth/qq/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         User.findOrCreate({ qqId: profile.id }, function (err, user) {
//             return done(err, user);
//         });
//     }
// ));//qq认证




router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('success')
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
    });



router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;
