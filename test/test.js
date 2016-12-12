var should = require('should'),
    assert = require('assert');

var request = require('supertest');
var mongoose = require('mongoose');

var app = require('../index');
var agent = request.agent(app);


//get models
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


/*
USER TESTS

1. Insert User
2. Get inserted User and verify its the one we inserted
3. Insert another User
4. Get list of all users and verify that they are the ones we inserted

POST TESTS

1. Add post
2. Get posts
3. Get post by sport
4. Upvote Post
5. Downvote Post
6. Check post scores and see that they were properly upvoted and downvoted

COMMENTS TESTS
1. Add 2 comment
2. Get all comments and verify they are the ones we inserted
3. Upvote Comment
4. Downvote Comment
5. Get all comments and verify that they were properly upvoted and downvoted

There are various error code tests at the end
Would have added more but mainly covered the ones we thought were important

*/

//dummy user data
var newUser1 = 
		{
		"username" : "User1",
		"password" : "1234",
		"comments" : [],
		"posts"    : []
		};

var newUser2 = 
		{
		"username" : "User2",
		"password" : "5678",
		"comments" : [],
		"posts"    : []
		};

//dummy post data
var post1 = 
		{
		"title" : "TEST1",
		"text" : "BLAHBLAHBLAHBLAH",
		"comments" : [],
		"score" : 0,
		"sport" : "Hockey",
		"tags": ["hockey", "NHL"],
        "poster" : "User1"
		};

var post2 = 
		{
		"title" : "TEST2",
		"text" : "BLAHBLAHBLAHBLAH",
		"comments" : [],
		"score" : 0,
		"sport" : "Basketball",
		"tags": ["bball", "NBA"],
        "poster" : "User2"
		};

var badpost = 		
        {
        "_id"   : "garbageid",
		"title" : "TEST2",
		"text" : "BLAHBLAHBLAHBLAH",
		"comments" : [],
		"score" : 0,
		"sport" : "garbage",
		"tags": ["bball", "NBA"],
        "poster" : "User2"
		};
		
//dummy comment data
var comment1 = 
        {
        "text" : "BLAHBLAH",
        "poster" : "User1"
        };

var comment2 = 
        {
        "text" : "BLAHBLAH",
        "poster" : "User2"
        };

var emptycomment =
        {
        "text" : "",
        "poster" : "User1"
        }


    describe('POST /user: Insert 1st User', function() {
      it('Inserted First Test User Successfully', function(done) {

        request(app)
        .post('/user')
	    .send(newUser1)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
	
		  console.log(res.body);

		  assert.equal(res.body.username, newUser1.username);
		  res.body.should.have.property('username');
		  res.body.should.have.property('comments');
		  res.body.should.have.property('posts');
		  res.body.should.have.property('score');
		  done();
        });
      });
    });

    describe('GET /users: Get data for user just inserted', function() {
      it('Retrieved First Test User Successfully', function(done) {
        request(app)
        .get('/users/User1')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body.username, newUser1.username);
		  res.body.should.have.property('username');
		  res.body.should.have.property('comments');
		  res.body.should.have.property('posts');
		  res.body.should.have.property('score');
         	 done();
        });
      });
    });


    describe('POST /user: Insert 2nd User', function() {
      it('Inserted Second Test User Successfully', function(done) {


        request(app)
        .post('/user')
	    .send(newUser2)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
	
		  console.log(res.body);

		  assert.equal(res.body.username, newUser2.username);
		  res.body.should.have.property('username');
		  res.body.should.have.property('comments');
		  res.body.should.have.property('posts');
		  res.body.should.have.property('score');
          	done();
        });
      });
    });


    describe('GET /users: Get all inserted users', function() {
      it('Retrieved all Users Successfully', function(done) {
        request(app)
        .get('/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[0].username, newUser1.username);
		  res.body[0].should.have.property('username');
		  res.body[0].should.have.property('comments');
		  res.body[0].should.have.property('posts');
		  res.body[0].should.have.property('score');

		  assert.equal(res.body[1].username, newUser2.username);
		  res.body[1].should.have.property('username');
		  res.body[1].should.have.property('comments');
		  res.body[1].should.have.property('posts');
		  res.body[1].should.have.property('score');
          done();
        });
      });
    });

    describe('POST /post: Insert 1st Post', function() {
      it('Inserted First Test Post Successfully', function(done) {


        request(app)
        .post('/post')
	    .send(post1)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
		      done();
        });
      });
    });

    describe('POST /post: Insert 2nd Post', function() {
      it('Inserted Second Test Post Successfully', function(done) {


        request(app)
        .post('/post')
	.send(post2)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

        done();
        });
      });
    });

    describe('GET /post: Get data for all posts', function() {
      it('Retrieved all posts successfully', function(done) {
        request(app)
        .get('/post')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[0].title, post1.title);
		  assert.equal(res.body[0].text, post1.text);
		  assert.equal(res.body[0].sport, post1.sport.toLowerCase());
		  assert.equal(res.body[0].tags[0], post1.tags[0]);
		  assert.equal(res.body[0].tags[1], post1.tags[1]);
		  res.body[0].should.have.property('title');
		  res.body[0].should.have.property('text');
		  res.body[0].should.have.property('sport');
		  res.body[0].should.have.property('score');
		  res.body[0].should.have.property('tags');
		  res.body[0].should.have.property('_id');
		  res.body[0].should.have.property('date_posted');
		  res.body[0].should.have.property('comments');

          post1._id = res.body[0]._id;

		  assert.equal(res.body[1].title, post2.title);
		  assert.equal(res.body[1].text, post2.text);
		  assert.equal(res.body[1].sport, post2.sport.toLowerCase());
		  assert.equal(res.body[1].tags[0], post2.tags[0]);
		  assert.equal(res.body[1].tags[1], post2.tags[1]);
		  res.body[1].should.have.property('title');
		  res.body[1].should.have.property('text');
		  res.body[1].should.have.property('sport');
		  res.body[1].should.have.property('score');
		  res.body[1].should.have.property('tags');
		  res.body[1].should.have.property('_id');
		  res.body[1].should.have.property('date_posted');
		  res.body[1].should.have.property('comments');

          post2._id = res.body[1]._id;

		  done();
        });
      });
    });

    describe('GET /sport/:sport/posts: Get a posts related to basketball', function() {
      it('Got all posts corresponding to basketball', function(done) {
        
        request(app)
        .get('/sport/basketball/posts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[0].sport, "basketball");
		  done();
        });
      });
    });

    describe('GET /post: Check that both posts were upvoted on creation', function() {
      it('Upvote check successful', function(done) {
        request(app)
        .get('/post')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[1].score, 1);
		  assert.equal(res.body[0].score, 1);

		  done();
        });
      });
    });

    describe('POST /comments: Insert 1st Comment', function() {
      it('Inserted First Test Comment Successfully', function(done) {

        request(app)
        .post('/comments')
	    .send(comment2)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
		      done();
        });
      });
    });

    describe('POST /comments: Insert 2nd Comment', function() {
      it('Inserted Second Test Comment Successfully', function(done) {

        request(app)
        .post('/comments')
	    .send(comment1)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
		      done();
        });
      });
    });

    describe('GET /comments: Get all inserted comments', function() {
      it('Retrieved all comments successfully', function(done) {
        request(app)
        .get('/comments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[0].text, comment1.text);
		  res.body[0].should.have.property('text');
		  res.body[0].should.have.property('score');
		  res.body[0].should.have.property('_id');
		  res.body[0].should.have.property('date_posted');
          comment1._id = res.body[0]._id;


		  assert.equal(res.body[1].text, comment2.text);
		  res.body[1].should.have.property('text');
		  res.body[1].should.have.property('score');
		  res.body[1].should.have.property('_id');
		  res.body[1].should.have.property('date_posted');
          comment2._id = res.body[1]._id;

		  done();
        });
      });
    });

    describe('PUT /comment/up/:id: Upvote a comment', function() {
      it('Successfully upvoted comment', function(done) {

        request(app)
        .put('/comment/up/'+comment1._id)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
		  done();
        });


      });
    });

    describe('PUT /comment/down/:id: Downvote a comment', function() {
      it('Successfully downvoted comment', function(done) {
        
        request(app)
        .put('/comment/down/'+comment2._id)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
		  done();
        });
      });
    });

    describe('GET /post: Check that Comment1 was upvoted and Comment2 was downvoted', function() {
      it('Upvoted and downvoted user successfully', function(done) {
        request(app)
        .get('/comments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

		  console.log(res.body);

		  assert.equal(res.body[1].score, -1);
		  assert.equal(res.body[0].score, 1);

		  done();
        });
      });
    });

    describe('GET /users: Try to get user that does not exist', function() {
      it('Server handles non-existent user search successfully', function(done) {
        request(app)
        .get('/users/IDoNotExist')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
         	 done();
        });
      });
    });

    describe('POST /user: Try to insert same user twice', function() {
      it('Server handles duplicate user insertion successfully', function(done) {

        request(app)
        .post('/user')
	    .send(newUser1)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
		  done();
        });
      });
    });

    describe('POST /comments: Attempt to post empty comment', function() {
      it('Empty comment check handled successfully', function(done) {

        request(app)
        .post('/comments')
	    .send(emptycomment)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
		      done();
        });
      });
    });

    describe('POST /post: Test for inserting a post with a sport that is not supported', function() {
      it('Server handles invalid sport field succesfully', function(done) {


        request(app)
        .post('/post')
	    .send(badpost)
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
		      done();
        });
      });
    });


    describe('DELETE /user: Delete 1st User', function() {
      it('Deleted First Test User Successfully', function(done) {

        request(app)
        .delete('/user/'+newUser1.username)
	    .send(newUser1)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
	
		  console.log(res.body);

		  done();
        });
      });
    });

    describe('DELETE /user: Delete 2nd User', function() {
      it('Deleted Second Test User Successfully', function(done) {

        request(app)
        .delete('/user/'+newUser2.username)
	    .send(newUser1)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
	
		  console.log(res.body);

		  done();
        });
      });
    });

    describe('GET /users: Check that first user deleted cant be retrieved because it does not exist anymore', function() {
      it('First User cannot be retrieved', function(done) {
        request(app)
        .delete('/users/User1')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
         	 done();
        });
      });
    });

    describe('GET /users: Check that second user deleted cant be retrieved because it does not exist anymore', function() {
      it('Second User cannot be retrieved', function(done) {
        request(app)
        .delete('/users/User2')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);

                //this is the last test so we are now going to remove the posts and comments we inserted
                //from the db
                //even if a user is deleted, his/her posts and comments are still kept up
                Post.find({ _id:post1._id }).remove().exec();
                Comment.find({ _id:comment1._id }).remove().exec();
                Post.find({ _id:post2._id }).remove().exec();
                Comment.find({ _id:comment2._id }).remove().exec();
         	 done();
        });
      });
    });


