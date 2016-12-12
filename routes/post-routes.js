"use strict"

var Post = require('../models/post');
var User = require('../models/user');
var session = require("client-sessions");
var nav = require('./nav-routes');


/* Get all posts */
exports.getPosts = function(req, res) {
	Post.find({}).sort('-date').exec(function(err, posts) {
		if(err) {
			throw err;
		}
		res.send(posts);
	});
};

/* Get all posts by id */
exports.getPostsById = function(req, res) {
	var postID = req.params.id;
	Post.findOne({_id: postID}, function(err, post) {
		if (err)
			throw err;

		if (post) {
			res.send(post);
		}
	});
};

/* Get all posts for sport */
exports.getPostsBySport = function(req, res) {
	let response = [];
	var sport = req.params.sport.toLowerCase();

	Post.find({sport: sport}).sort('-date').exec(function(err, posts) {
		if (err) {
			throw err;
		}
		res.send(posts);
	});
};


/* Get all posts by user */
exports.getPostsByUser = function(req, res) {
	let response = [];
	var user = req.params.user;
	Post.find({ poster: user}).sort('-date').exec(function(err, posts) {
		if (err) {
			throw err;
		}
		res.send(posts);
	});
};


/* Upvote post with id */
exports.upVotePost = function(req, res) {
	var postID = req.params.id;
	var increment = 1; // the amount the vote will count for

	// find the upvoting user and see if they've upvoted this before
	User.findOne({username: req.session.user}, function(err, user) {

		if (err)
			throw err;


		else {
			// if the user has upvoted this before, they are going to undo it
			if (user.upvoted.indexOf(postID) != -1) {
				increment = -1;
			}

			// if they downvoted it, they are now changing their mind
			if (user.downvoted.indexOf(postID) != -1) {
				increment = 2;
			}

			Post.findOneAndUpdate({_id: postID}, { $inc: { score: increment }}, {'new' : true}, function(err, post) {
				if (err)
					throw err;

				if (post) {
					// increment the poster's total score as well
				User.findOneAndUpdate({username: post.poster}, {$inc: {score: increment}}, function(err, poster) {
						var sendSuccess = function(err) {
							if (err)
								throw err;
							else  {
								res.send({newscore : post.score});
							}
						}
						if (err)
							throw err;
						else
							if (increment == -1) {
								User.findOneAndUpdate(
									{username: req.session.user},
									{$pull : {upvoted : { $in : [postID]}}},
									sendSuccess
								);
							}
							else if (increment == 2) {
								User.findOneAndUpdate(
									{username: req.session.user},
									{$pull : {downvoted : { $in : [postID]}}},
									function() {
										User.findOneAndUpdate(
											{username: req.session.user},
											{$push : {upvoted : postID}},
											{safe: true, upsert: true},
											sendSuccess
										);
									}
								);
							}
							else {
								User.findOneAndUpdate(
									{username: req.session.user},
									{$push : {upvoted : postID}},
									{safe: true, upsert: true, new: true},
									sendSuccess
								);
							}
					});
				}
				else {
					res.status(400).send("Failure to upvote");
				}
			});
		}
	});
};

/* Downvote post with id */
exports.downVotePost = function(req, res) {
	var postID = req.params.id;
	var increment = -1; // the amount the vote will count for

	// find the upvoting user and see if they've upvoted this before
	User.findOne({username: req.session.user}, function(err, user) {

		// if the user has upvoted this before, they are going to undo it
		if (user.downvoted.indexOf(postID) != -1) {
			increment = 1;
		}

		// if they downvoted it, they are now changing their mind
		if (user.upvoted.indexOf(postID) != -1) {
			increment = -2;
		}

		Post.findOneAndUpdate({_id: postID}, { $inc: { score: increment }}, {'new' : true}, function(err, post) {
			if (err)
				throw err;

			if (post) {

				var sendSuccess = function(err, user) {
					if (err) throw err;
					else  {
						res.send({newscore : post.score});
					}
				}

				// increment the poster's total score as well
				User.findOneAndUpdate({username: post.poster}, {$inc: {score: increment}}, function(err, poster) {
					if (err)
						throw err;
					else
						if (increment == 1) {
							User.findOneAndUpdate(
								{username: req.session.user},
								{$pull : {downvoted : { $in : [postID]}}},
								sendSuccess
							);
						}
						else if (increment == -2) {
							User.findOneAndUpdate(
								{username: req.session.user},
								{$pull : {upvoted : { $in : [postID]}}},
								function() {
									User.findOneAndUpdate(
										{username: req.session.user},
										{$push : {downvoted : postID}},
										{safe: true, upsert: true},
										sendSuccess
									);
								}
							);
						}
						else {
							User.findOneAndUpdate(
								{username: req.session.user},
								{$push : {downvoted : postID}},
								{safe: true, upsert: true, new: true},
								sendSuccess
							);
						}
				});
			}
			else {
				res.status(400).send("Failure to upvote");
			}
		});
	});
};

/* Add new posts */
exports.addPost = function(req, res) {
	var newPostData = req.body;

	if (nav.allSports.indexOf(newPostData.sport) == -1) {
		res.status(400).send("Invalid sport");
		return;
	}

	// ensure all of the data is properly formatted
	newPostData.sport = newPostData.sport.toLowerCase();
	newPostData.poster = req.session.user;
	newPostData.comments = [];
	newPostData.tags.push(newPostData.sport); // include the sport as a tag

	// remove duplicate tags from the array
	newPostData.tags = newPostData.tags.filter(function(elem, index, self) {
    	return index == self.indexOf(elem);
	});

	console.log(newPostData.tags);

	var new_post = new Post(newPostData);

	new_post.save( function(error, post) {
		if(error){
			res.json(error);
		}
		else{
			// add this comment to the post.  Automatically make the poster
			// upvote it as well
	        User.findOneAndUpdate(
	            {username : post.poster},
	            {$push : {posts : post._id, upvoted : post._id}},
	            function(err, user) {
	                if (err)
	                    throw err;
	                else {
						Post.findOneAndUpdate({_id: post._id}, { $inc: { score: 1 }}, {'new' : true}, function(err, post) {
							User.findOneAndUpdate({username : post.poster}, { $inc : { score : 1}}, function(err, user) {
								if (err) throw err;
								res.send("Success");
							});
						});
	                }
	        })
		}
	});
};


/* Get all posts with the specified tags */
exports.getPostsByTag = function(req, res) {
	let response = [];
	var tag = req.params.tag;
	Post.find({}, function(err, posts) {
		if(err) {
			throw err;
		}
		posts.forEach(function(post) {
			for (var i = post.tags.length - 1; i >= 0; i--) {
				if (post.tags[i] === tag) {
					response.push(post);
				}
			};
		});
		res.send(response);
	});
};
