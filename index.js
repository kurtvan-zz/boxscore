"use strict";

var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("client-sessions");

var nav = require('./routes/nav-routes');
var user = require('./routes/user-routes.js');
var comment = require('./routes/comment-routes.js');
var post = require('./routes/post-routes.js');
var auth = require('./routes/auth-routes.js');
var admin = require('./routes/admin-routes.js');

module.exports = app;

// use body parser as middleware
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// use handlebars as a view engine, to allow for templating
app.engine('.hbs', nav.hbs.engine);
app.set('view engine', '.hbs');

// add the static files to the path
app.use(express.static(path.join(__dirname, '/public')));

// use sessions middleware
app.use(session({
    cookieName : 'session',
    secret : 'european-swallow-holding-a-coconut',
    duration : 60 * 60 * 1000, // leftmost number is minutes
    activeDuration : 5 * 60 * 1000
}));

// routes for page navigation
app.get("/", nav.getMainPage);
app.get('/sport/:sport', nav.getSportsPage);
app.get("/post/:id", nav.getPostPage);
app.get("/user/:user", nav.getUserPage);
app.get("/myprofile", nav.getMyProfilePage);
app.get("/notfound", nav.getNotFoundPage);


// post routes
app.post("/post", post.addPost);
app.get("/post", post.getPosts);
app.get("/user/:user/posts", post.getPostsByUser);
app.get("/sport/:sport/posts", post.getPostsBySport);
app.put("/post/up/:id", post.upVotePost);
app.put("/post/down/:id", post.downVotePost);
app.get("/search/:tag", post.getPostsByTag);


// login and signup routes
app.get("/welcome", function(req, res) {
    res.render('login', {layout: false, loginError: "", signupError: ""})
});

app.post('/login', auth.login);
app.post('/signup', auth.signup);
app.get('/logout', auth.logout);


//user routes
app.get('/users', user.getUsers);
app.get('/users/:username', user.findUser);
app.post('/user', user.addUser);
app.delete('/user/:username', user.deleteUserByUsername);
app.put('/users/', user.updateUser);
app.post('/updatePassword', user.updatePassword);

// comment routes
app.get("/comments", comment.getComments);
app.get("/comments/users/:user", comment.getCommentsOfAUser);
app.get("/comments/posts/:post", comment.getCommentsOfAPost);
app.post("/comments", comment.addComment);
app.put("/comment/up/:id", comment.upVoteComment);
app.put("/comment/down/:id", comment.downVoteComment);

// admin routes
app.use(express.static(__dirname + '/admin'));
app.get("/admin", nav.getAdminPage);


app.get("/admin/users", admin.getUsers);
app.get("/admin/posts", admin.getPosts);
app.delete('/admin/users/:username', admin.deleteUserByUsername);
app.delete('/admin/posts/:id', admin.deletePostById);
app.put("/admin/users", admin.changePasswordOfAUser);


// listen for connections
app.listen(process.env.PORT || 3000, function() {
    console.log("listening on port " + (process.env.PORT || 3000) + " ...");
});
