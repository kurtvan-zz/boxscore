"use strict"

var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');

exports.getComments = function(req, res) {
    Comment.find({}, function(err, comments) {
        if(err) {
            throw err;
        }
        res.send(comments);
    });
}

exports.getCommentsOfAUser = function(req, res) {
    let response = [];
    var username = req.params.user;

    Comment.find({}, function(err, comments) {
        if(err) {
            throw err;
        }
        comments.forEach(function(comment) {
            if(comment.poster == username) {
                response.push(comment);
            }
        });
        res.send(response);
    });
};


exports.getCommentsOfAPost = function(req, res) {
    let response = [];
    let postId = req.params.post;

    Post.find({}).populate("comments").exec(function(err, posts) {
        if(err) {
            throw err;
        }
        posts.forEach(function(post) {
            if(post.id == postId) {
                response.push(post.comments);
            }
        });

        res.send(response);
    });
};


exports.addComment = function(req, res) {

    var commentData = {
        text: req.body.text,
        poster: req.session.user,
    };

    if (commentData.text == "") {
        res.status(400).send("Error: Empty input");
    }

    else {
        let newComment = new Comment(commentData);

        newComment.save(function(err, newComment) {
            if(err) {
                throw err;
            }

            // add this comment to the post
            Post.findOneAndUpdate(
                {_id: req.body.postID},
                {$push : {comments : newComment._id}},
                function(err, post) {
                    if (err)
                        throw err;
                    else {
                        res.send("Success");
                    }
                }
            )
        });
    }
};

exports.upVoteComment = function(req, res) {
    let commentId = req.params.id;
    Comment.find({}, function(err, comments) {
        if(err) {
            throw err;
        }
        comments.forEach(function(comment) {
            if(comment.id == commentId) {
                comment.score++;
                comment.save({"score": comment.score}, function(err, score) {
                    res.send("Success");
                });
            }
            
        });
    });
};

exports.downVoteComment = function(req, res) {
    // can a comment have negative score??
    let commentId = req.params.id;
    Comment.find({}, function(err, comments) {
        if(err) {
            throw err;
        }
        comments.forEach(function(comment) {
            if(comment.id == commentId) {
                comment.score--;
                comment.save({"score": comment.score}, function(err, score) {
                    res.send("Success");
                });
            }

        });
    });
};
