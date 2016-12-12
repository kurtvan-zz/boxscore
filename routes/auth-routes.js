"use strict";

var bcrypt = require("bcrypt");
var session = require("client-sessions");
var User = require('../models/user');
var allSports = require('./nav-routes').allSports;


exports.saltRounds = 10;

/* Check the database for the given user and compate the hashed passwords
 * that are given.  If this user does not exist or the password is wrong, send
 * them back to the same page with an error message
 */
exports.login = function(req, res) {

    // get the login credentials
    var username = req.body.username;
    var password = req.body.password;

    // check if this user exists
    User.findOne({username: username}, function(err, user) {
        // if they dont exist, return an error
        if (!user) {
            res.render('login', {layout: false, signup: false, login: true, loginError: "Invalid username or password", signupError: ""})
        }

        // if they do, check the hashes against eachother
        else {
            // hash password and check if it matches the db
            bcrypt.compare(password, user.password, function(err, valid) {

                if (valid == true) {
                    req.session.user = username; // set new session cookie
                    res.redirect('/'); // send them to the main page
                } else {
                    res.render('login', {layout: false, signup: false, login: true, loginError: "Invalid username or password", signupError: ""})
                }
            });
        }
    });
}

/* Sign up a new user. If the user already exists, or the password confirmation
 * does not match, reload with an error message.
 */
exports.signup = function(req, res) {
    var new_user_data = req.body;

    if (new_user_data.password != new_user_data.passwordconf) {
        res.render('login', {layout: false, signup: true, login: false, loginError: "", signupError: "Passwords must match"});
        return;
    }

    User.findOne({username: new_user_data.username}, function(err, user) {
        if (!user) {
            // generate salt and hash
            bcrypt.genSalt(exports.saltRounds, function(err, salt) {
                new_user_data.salt = salt;
                bcrypt.hash(new_user_data.password, salt, function(err, hash) {
                    new_user_data.password = hash;
                    console.log("Made hash: " + new_user_data.password);

                    // new user with salt and hash are inserted into the database
                    var new_user = new User(new_user_data);

                    new_user.save(function(error, data) {
                        if(error){
                            res.json(error);
                        } else{
                            req.session.user = new_user_data.username;
                            res.redirect('/');
                        }
                    });
                });
            });
        } else {
            res.render('login', {layout: false, signup: true, login: false, loginError: "", signupError: "User already exists"})
        }
    });
}

/* Log out the currently signed in user. Reset the session so that no
 * session data is left in the browser, and bring the user back to the
 * login page
 */
exports.logout = function(req, res) {
    req.session.reset();
    res.redirect('/welcome');
}
