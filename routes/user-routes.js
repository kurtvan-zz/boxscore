"use strict";

var bcrypt = require("bcrypt");
var session = require("client-sessions");
var User = require('../models/user');
var allSports = require('./nav-routes').allSports;

const saltRounds = 10;


/* Return full records for all users in the database
 */
exports.getUsers = function(req, res) {
	User.find({}, function(err, users) {

	    var i;
        //remove fields that we do not want to expose to client
	    for (i = 0; i < users.length; i++)
	    {
		    users[i].password = undefined;
		    users[i]._id = undefined;
		    users[i].__v = undefined;
		    users[i].salt = undefined;
	    }

		res.send(users);
	});
};

/* Find a user given their username. If the user does not exists send a 404
 * error code
 */
exports.findUser = function(req, res) {
	var username = req.params.username;

	//search for user by username
	User.findOne({username: username}, function(err, user) {
		if (err) throw err;
		if(user)
        {
			//remove fields that we do not want to expose to client
			user.password = undefined;
			user._id = undefined;
			user.__v = undefined;
			user.salt = undefined;
			res.send(user);
        }
		else
			res.status(404).send("No user with matching username found in database.");
	});
};

// Because this function represents its own route, it should only be usable
// by admins (perform a session check for admin)
exports.addUser = function(req, res) {

	var new_user_data = req.body;
	new_user_data["salt"] = "";

	User.findOne({username: new_user_data.username}, function(err, user) {
		if (err) throw err;

		if(user)
		{
			res.status(404).send("User with username already exists.");
		}
		else
        {

			bcrypt.genSalt(saltRounds, function(err, salt) {
				new_user_data.salt = salt;
				bcrypt.hash(new_user_data.password, salt, function(err, hash) {
				new_user_data.password = hash;
				console.log("Made hash: " + new_user_data.password);

				// new user with salt and hash are inserted into the database
				var new_user = new User(new_user_data);

				new_user.save(function(error, data) {
					if(error){
					res.json(error);
					} 
					else
					res.json(data);
					});
				});

			res.status(200);
			});


		}

	});


};

exports.deleteUserByUsername = function(req, res) {


	var username = req.params.username;

	//search for user by username
	User.findOne({username: username}, function(err, user) {
		if (err) throw err;

		//if found delete it
		if(user)
		{
			User.find({ username:username }).remove().exec();
			return res.send("Deleted user: " + user.username);
		}
		else
			res.status(404).send("No user with matching username found in database.");
	});


};

/*
exports.deleteUserById = function(req, res) {

	var id = req.params.id;

	//search for user by username
	User.findOne({id: id}, function(err, user) {
		if (err) throw err;

		//if found delete it
		if(user)
			User.find({ id:id }).remove().exec();
		//404 if not found
		else
			res.status(404).send("No user with matching id found in database.");
	});


};
*/

exports.updateUser = function(req, res) {

	var new_user_data = req.body;
	new_user_data["salt"] = "";

	User.findOne({username: new_user_data.username}, function(err, user) {
		if (err) throw err;

		if(!user)
		{
			res.status(404).send("No user with matching username found in database.");
		}
		else
		{


			bcrypt.genSalt(saltRounds, function(err, salt) {
				new_user_data.salt = salt;
				bcrypt.hash(new_user_data.password, salt, function(err, hash) {
				new_user_data.password = hash;
				console.log("Made hash: " + new_user_data.password);

				});
			});


			User.findOneAndUpdate({username:new_user_data.username}, new_user_data, function(err, doc){
				if (err) throw err;

				return res.send("Updated user: " + new_user_data.username);
			});

		}

	});
};

exports.updatePassword = function(req, res) {
	var newPassword = req.body.password;

	// generate new password hash
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(newPassword, salt, function(err, hash) {
			newPassword = hash;
			console.log("Made hash: " + newPassword);

			// now find this user and update em
			User.findOneAndUpdate({username: req.session.user}, {password : newPassword}, function(err, user) {
				if (err)
					throw err;
				res.send("Success");
			});
		});
	});
}
