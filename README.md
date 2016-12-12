# Group 9 Project

## Initialization
From the project root directory, run `npm install` then create a directory to store the db in:

`mkdir data`

Then run `mongod --dbpath=$PWD/data` to start up the database.

## Testing (mocha)
Mocha test suite should be run with an empty db, as it inserts and removes users. Otherwise it might show failures.
These are not actual failures. The test set was designed for an initial db with nothing in it. The output of the tests show what was being tested with the returned response body being logged to stdout. For further details about the tests, they can be found in test/test.js

To run test suite:

`npm test`

## Running the app
After running the tests, we will need to seed the db with some basic posts, comments, and users.
This is to mimic actual use of the app. Enter the following commands:

```
mongoimport --db group9db --collection users --type json --file dataseeds/user-seed.json
mongoimport --db group9db --collection posts --type json --file dataseeds/post-seed.json
mongoimport --db group9db --collection comments --type json --file dataseeds/comment-seed.json
```
Then run the app by typing:

`node index.js`

Then go to localhost:3000 in Google Chrome to view the app.

## Description of App
The boxscore is an online discussion forum for sports. Users first access the login page where they can either sign up by entering their username and confirming their password or login if they already have a username and password.

The user list for the seeded non-admin users:

1) username:kurtvan password:kurtvan

2) username:berk password:berk

3) username:paul password:paul

4) username:kazi password:kazi

Admin users:

username: admin password:admin

There are six discussion pages one for each of the following sports: hockey, baseball, football, basketball, golf, tennis. Users can make a new post under one of these pages. Each post consists of a title, text body, and include tags so other users can search for posts by tag. The user's post is automatically upvoted upon creation. A user can upvote and downvote the posts all posts. Pressing the boxscore logo on the top shows all the posts regardless of tag or sport. All post displays are sorted with the most recent posts at the top.

The user can also comment on created posts.

The user can enter a tag on the search bar to search for posts by a specific 1 word string tag. (i.e. "Leafs" if they are looking up a post about a specific team or whatever tag they want as tags can be pretty much anything) Tags are not visible, so the user who makes the tag has to kind of know what they are searching for with this. For marking purposes some tags we created are "ramos" for one of the posts and "raonic" for another post or "raptors" if you wish to see a tag search return multiple posts. You can look inside our seed files to see the tags for the pre-loaded content and search accordingly to better test our search. Furthermore, you can create your own set of posts with a shared tag and then search them up using that shared tag to display all the posts that you put in to test the tag search.

Clicking one of the headings for sports will show all the posts made regarding that sport.

The user can access their own profile page and change their password. They can also view all of their own posts on this page. They can also see their overall post score on this page which is the total of the score of all of their posts.

The forum has a sidebar that when the show events button is pressed, it shows information pulled using the Stubhub API to display information about upcoming events for various different sports. The sidebar shows the event title, location and a link to purchase tickets from Stubhub.

The admin panel is only available to users that have been specified as admins. This is done on the backend and we have already seeded users that are admins. The admin user to be used by the TA marking this assignment is username:admin
and password:admin. Once logged in as admin go to localhost:3000/admin. The reason why we did not put a button to go there was given the nature of the admin they should be able to just enter a url to go to their setup as its for testing and admin purposes. The admin can change passwords, list and remove users as well as list and delete posts. The user list shows the users and their total scores. The username can be input into the remove by username form to delete a user. Admin users cannot be deleted. Furthermore, the list posts button shows the post title, post id, poster and date. The post id can be entered into the delete post by id form to delete the post. Deleted users can still have their posts up, as this was a decision on our part. These "zombie" posts can still be deleted by deleting by post id.

The database has collections for the users, posts and comments.

Each user schema contains username, password, whether or not they are an admin, salt, array of comments, array of posts, total score of all posts submitted, array of posts that they upvoted and array of posts that they downvoted.

Each post schema contains the title of the post, text body, array of comments, score, array of tags, the poster's username and the date.

Each comment schema contains the text, username of commentor, and date commented.

## Extra Features
The extra features that we implemented on top of the basic requirements were:

1) **Mocha unit tests:** tested various error codes and made sure backend was working properly for user, post and comment routes.

2) **Third Party API:** logged into, authenticated and requested information from Stubhub API to get event ticket information.

3) **Security:** used bcrypt to encrypt passwords, made sure data returned from server only contained data that the client needed and avoided exposing internals.

