"use strict";

/* This module contains all of the functions for rendering html template files
 * and serving them based on REST calls and their parameters
 */

var exphbs = require('express-handlebars');
var session = require("client-sessions");
var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");
var mongoose = require("mongoose");


// This reflects all of the options that will appear at the top
// of the page
exports.allSports = ['Football', 'Hockey', 'Baseball', 'Golf', 'Tennis', 'Basketball'];

exports.hbs = exphbs.create({
    defaultLayout: 'main.hbs',
    helpers: {}
});

// ------ Functions for rendering different pages -------

exports.getMainPage = function(req, res) {

    if (req.session && req.session.user) {
        res.render('home',
            {
                username: req.session.user,
                allSports: exports.allSports,
                helpers: {
                    isCurSport: function(thisSport) {
                        if (thisSport.toLowerCase() == "")
                            return true;
                        else
                            return false;
                    }
                }
            }
        )
    }
    else {
        res.redirect('/welcome');
    }
};

exports.getSportsPage = function(req, res) {
    var sport = req.params.sport;
    var validSport = false;

    // check if this is a valid sport
    for (var i = 0; i < exports.allSports.length; i++) {
        if (exports.allSports[i].toLowerCase() == sport) {
            validSport = true;
        }
    }

    // if not, send a not found page
    if (!validSport) {
        res.redirect('/notfound');
        return;
    }


    res.render('sport', {
            allSports : exports.allSports,
            username : req.session.user,
            curSport: sport,
            helpers: {
                isCurSport: function(thisSport) {
                    if (thisSport.toLowerCase() == sport)
                        return true;
                    else
                        return false;
                }
            }
        }
    )
};

/* Get the post page for a user specified in the route parameter
 * this includes a call for fetching all of the comments for this
 * post.
 */
exports.getPostPage = function(req, res) {

    var thisPost;
    // get the post by its ID
    try {
        var postID = new mongoose.Types.ObjectId(req.params.id);
    }
    catch(err) {
        res.redirect('/notfound');
        return;
    }
    postID = req.params.id;

	Post.findOne({ _id: postID }, function(err, post) {
		if (err)
			throw err;

		if (post) {
            // get post info
			thisPost = post;
            var newDate = thisPost.date_posted;
            // parse the date to be readable
            var postDateStr = [newDate.getFullYear(),
                    (newDate.getMonth()>9 ? '' : '0') + newDate.getMonth(),
                    (newDate.getDate()>9 ? '' : '0') + newDate.getDate()
                ].join('-');
            // find all of the comments for this post
            Comment.find({}, function(err, comments) {
                var fullComments = [];
                for (var i = 0; i < comments.length; i++) {
                    if(thisPost.comments.indexOf(comments[i]._id) >= 0) {
                        var tempComment = comments[i]
                        tempComment.date = [comments[i].date_posted.getFullYear(),
                                (comments[i].date_posted.getMonth()>9 ? '' : '0') + comments[i].date_posted.getMonth(),
                                (comments[i].date_posted.getDate()>9 ? '' : '0') + comments[i].date_posted.getDate()
                            ].join('-');
                        fullComments.push(tempComment);
                    }
                }

                // render with the correct context
                res.render('post',
                    {
                        username: req.session.user,
                        title: thisPost.title,
                        poster: thisPost.poster,
                        date: postDateStr,
                        postText: thisPost.text,
                        postID: thisPost._id,
                        allSports: exports.allSports,
                        comments: fullComments,
                        helpers: {
                            isCurSport: function(thisSport) {
                                if (thisSport.toLowerCase() == "")
                                    return true;
                                else
                                    return false;
                            }
                        }
                    }
                );
            })
		} else {
            res.redirect('/notfound');
        }
	});
};

/* Get the profile page for the specified user.
 */
exports.getUserPage = function(req, res) {

    var userData = req.params.user;
    User.findOne({username : userData}, function(err, user) {
        if (user) {
            res.render('user',
                {
                    username: req.session.user,
                    viewedUser: user.username,
                    score: user.score,
                    allSports: exports.allSports,
                    helpers: {
                        isCurSport: function(thisSport) {
                            if (thisSport.toLowerCase() == "")
                                return true;
                            else
                                return false;
                        }
                    }
                }
            )
        } else {
            res.redirect('/notfound');
        }
    })
};

/* Send the profile page for the current user in the session.  This is
 * different from a regular profile page in that it is personal and can
 * only be edited by this user
 */
exports.getMyProfilePage = function(req, res) {

    // get all of this users info:
    User.findOne({username : req.session.user}, function(err, user) {

        if (err)
            throw err;
        if (user) {
            res.render('myprofile',
                {
                    allSports : exports.allSports,
                    username: req.session.user,
                    score: user.score,
                    helpers: {
                        isCurSport: function(thisSport) {
                            if (thisSport.toLowerCase() == "")
                                return true;
                            else
                                return false;
                        }
                    }
                }
            );
        }
    });
}

exports.getAdminPage = function(req, res) {

    // get the current user
    var username = req.session.user;

    User.findOne({username: username}, function(err, user) {
        if (err)
            throw err;

        // if this user is an admin, let them through
        if (user) {
            if (user.admin == true) {
                res.render('admin',
                    {
                        layout: false,
                        username: req.session.user
                    });
            }
            else {
                res.redirect('/');
            }
        }

    });

};

/* Render 404 page with variable error message
 */
exports.getNotFoundPage = function(req, res) {
    res.render('notfound',
        {
            notFoundMsg : "There was a problem finding the resource.  If you were looking for a user they may have been deleted",
            username: req.session.user
        }
    );
}
