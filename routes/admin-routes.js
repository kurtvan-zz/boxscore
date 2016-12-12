"use strict";

var bcrypt = require("bcrypt");
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');

const saltRounds = 10;

exports.getUsers = function(req, res) {
    User.find({}, function(err, users) {
        if(err) {
            throw err;
        }
        res.send(users);
    });
}

exports.getPosts = function(req, res) {
    Post.find({}, function(err, posts) {
        if(err) {
            throw err;
        }
        res.send(posts);
    });
}

exports.deleteUserByUsername = function(req, res) {
    let matchedUsername = 0;
    let username = req.params.username
    // Remove user by username
    User.findOne({username: username}, function(err, user) {
		if(err) {
            throw err;
        }
        if(user) {
            console.log(user);
            if(!user.admin) {
                matchedUsername++;
                User.find({username: username}).remove().exec();
                res.send("Success");
            }
            else {
                console.log("You can't delete an admin.");
                res.send("You can't delete an admin.");
            }
        }
        else {
            if(matchedUsername == 0) {
                res.send("Error");
                console.log("No such user exists.");
            }
        }
    });

}

exports.deletePostById = function(req, res) {
    let matchedId = 0;
    let id = req.params.id;
    if (id.length == 24) {
        // Remove post by id
        Post.findOne({_id: id}, function(err, post) {
            console.log(post);
    		if(err) {
                throw err;
            }
            if(post) {
                console.log(post.poster);
                matchedId++;
                var postScore = post.score;
                User.findOneAndUpdate({username: post.poster}, {$inc: { score: (postScore*-1)}}, {'new' : true}, function(err, post) {
                    Post.find({_id: id}).remove().exec();
                    res.send("Success");
                })

            }
            else {
                if(matchedId == 0) {
                    res.send("Error");
                    console.log("No such post exists.");
                }
            }
        });
    }
    else {
        res.send("Error");
    }
}

exports.changePasswordOfAUser = function(req, res) {
    let newPassword = req.body.password;
    let username = req.body.username;
    console.log(req.body);
    User.findOne({username: username}, function(err, user) {
        if(err) {
            throw err;
        }
        // if such user exists
        if(user) {
            let update = {password: newPassword};

	        bcrypt.genSalt(saltRounds, function(err, salt) {
		        bcrypt.hash(newPassword, salt, function(err, hash) {
			        newPassword = hash;
			        console.log("Made hash: " + newPassword);

			        // now find this user and update em
			        User.findOneAndUpdate({username: username}, {password : newPassword}, function(err, user) {
				        if (err)
					        throw err;
				        res.send("Success");
			        });
		        });
	        });

            }
        // no such user exists;
        else {
            console.log("No such user exists.");
            res.send("Error");
        }


    });


}
