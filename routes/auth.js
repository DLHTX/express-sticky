var express = require('express');
var router = express.Router();
var Note = require('../models/note.js').Note

var passport = require('passport');//passport模块专门处理登录
var GitHubStrategy = require('passport-github').Strategy;


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
        clientSecret: 'baa427b5004568850b9d3aafb700190a78b2222b',
        callbackURL: "http://localhost:5000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));


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
})


module.exports = router;
