"use strict";

/*  This module defines all of the navigation for the app, and includes
 *  all of the AJAX calls that the app utilizes
 */
const POST_TEXT_CUTOFF = 300;
const POST_TITLE_CUTOFF = 100;
var postTemplate;


// Function for formatting mongoose dates
Date.prototype.format = function() {
  var month = this.getMonth() + 1;
  var day = this.getDate();

  return [this.getFullYear(),
          (month>9 ? '' : '0') + month,
          (day>9 ? '' : '0') + day
      ].join('-');
};

/*  Create a blank post template
 */
var initPostTemplate = function(container) {

    // create clone of existing template
    var template = $(".post-card").first().clone();
    template.find(".post-title").empty();
    template.find(".post-date").empty();
    template.find(".poster-name").empty();
    template.find(".post-text").empty();

    // Remove the blank post from the html file
    $(container).empty();
    return template;

}

/** Inserts a new post at the bottom of the page, to be used for adding in
 *  posts via AJAX after loading a page.
 * @param {String} title - the title text for the post
 * @param {String} date - some string representing the date that the post was created
 * @param {String} username - the username of the poster
 * @param {String} text - the actual text of the post
 * @param {String} id - the id of this post in the database, used to add a click handler
 * to the read more button
 */
var insertPost = function(template, container, title, date, username, text, score, id, state) {
    // create empty post to add informatio to
    var newPost = template.clone();
    var shortenedTitle = title;
    var shortenedText = text;

    // update its fields with the relevant information
    newPost.find(".post-date").html(date);
    newPost.find(".poster-name").html("by " + username);
    newPost.find(".score").html(score);
    newPost.find(".id").html(id);
    newPost.find(".read-more-button").attr('href', '/post/' + id);
    newPost.find(".poster-name").attr('href', '/user/' + username);

    if (state == 1) {
        newPost.find(".upvote").css("color", "green");
    }
    else if (state == -1) {
        newPost.find(".downvote").css("color", "red");
    }

    newPost.find(".upvote").click(function() {
        var id = $(this).parent().parent().find(".id").html();


        $.ajax({
            url: "/post/up/" + id,
            type: "PUT",
            success: function(data) {
                var oldValue = this.parent().parent().find(".score").html();
                this.parent().parent().find(".score").html(data.newscore);
                if (data.newscore > oldValue) {
                    this.parent().parent().find(".upvote").css("color", "green");
                    this.parent().parent().find(".downvote").css("color", "black");
                }
                else
                    this.parent().parent().find(".upvote").css("color", "black");
            }.bind($(this)),
            error: function() {

            }
        });
    });

    newPost.find(".downvote").click(function() {
        var id = $(this).parent().parent().find(".id").html();

        $.ajax({
            url: "/post/down/" + id,
            type: "PUT",
            success: function(data) {
                var oldValue = this.parent().parent().find(".score").html();
                this.parent().parent().find(".score").html(data.newscore);
                if (data.newscore < oldValue) {
                    this.parent().parent().find(".downvote").css("color", "red");
                    this.parent().parent().find(".upvote").css("color", "black");
                }
                else
                    this.parent().parent().find(".downvote").css("color", "black");

            }.bind($(this)),

            error: function() {

            }
        });
    });

    // we don't want to include the entire title if it is too long
    if (shortenedTitle.length > POST_TITLE_CUTOFF) {
        shortenedTitle = shortenedTitle.substring(0,POST_TITLE_CUTOFF) + " ... ";
    }
    newPost.find(".post-title").html(shortenedTitle);

    // we don't want to include all of the text if it is too long
    if (shortenedText.length > POST_TEXT_CUTOFF) {
        shortenedText = shortenedText.substring(0,POST_TEXT_CUTOFF) + " ... ";
    }
    newPost.find(".post-text").html(shortenedText);

    // finally, place this post at the end of the page
    $(container).append(newPost);
}



/* Executes when the page is fully loaded
 */
$(document).ready(function() {

    // make the nav bar point to the appropriate routes
    $('.sport-entry').each(function() {
        $(this).attr('href', '/sport/' + $(this).html().toLowerCase());
    });

    // open and close the profile window with the button
    $('#profile-button').click(function() {
        ui.toggleProfileWindow();
    });

    $('#new-post-button').click(function() {
        ui.togglePostEditor();
    });

    $('#close-post-editor').click(function() {
        ui.closePostEditor();
    });

    $(".score").click(function() {
        console.log("sefef");
    });


    // handle key press events
    $(document).keyup(function(e) {
        // escape key closes the editor
        if (e.keyCode == 27) {
            ui.closePostEditor();
        }
    });

    $("#logout-button").click(function() {
        window.location.href = '/logout';
    });

    $("#submit-post").click(function(e) {
        e.preventDefault();
        var postData = {
            title: $("#post-editor input[name=title]").val(),
            text: $("#post-editor textarea").val(),
            sport: $("select :selected").text(), // The text content of the selected option
            tags: $("input[name=tags]").val().split(" ")
        };

        $.post("/post", postData, function(data) {
            console.log("Success!");
            $("#post-success").show();
            $("#post-editor input, #post-editor textarea").val("");
        });
    });

    $("#comment-form").submit(function(e) {
        e.preventDefault();


        $.ajax({
            type: "POST",
            url: "/comments",
            data: {
                text : $("#comment-input").val(),
                postID: $("#id").html()
            },
            success: function(data) {
                console.log("Success!!!");
                $("#comment-input").val("");
                location.reload(); // reload to make new comment appear
            },
            error: function(data) {
                console.log("Bad request");
                $("#comment-form p").css("display", "inline"); // show the error message
            }


        });
    });

    $(".update-info").submit(function(e) {
        e.preventDefault();
        $.post("/updatePassword",
            {
                password : $("input[name=new-password]").val()
            },
            function() {
                $("#update-success").show();
                $("input[name=new-password]").val("");
            }
        )
    });





    // Prapare post wells to have posts inserted into them
    postTemplate = initPostTemplate("#post-well");
    initPostTemplate("#user-post-well");


    var sport = "";

    $("#sports-list a").each(function() {
        if ($(this).hasClass("current-sport")) {
            sport = $(this).html();
        }
    });

    var upvoted;
    var downvoted;

    // get the users list of upvoted posts
    $.get("/users/" + $("#profile-window-username").html(), function(data) {
        upvoted = data.upvoted;
        downvoted = data.downvoted;

        // Load in all of the posts for this page
        if (sport != "") {
            $.get("/sport/" + sport + "/posts", function(data) {
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].date_posted);
                    var state = 0;
                    if (upvoted.indexOf(data[i]._id) != -1)
                        state = 1;
                    else if (downvoted.indexOf(data[i]._id) != -1)
                        state = -1
                    console.log(data[i]._id);
                    insertPost(postTemplate, "#post-well", data[i].title, date.format(), data[i].poster, data[i].text, data[i].score, data[i]._id, state);
                }
            });
        }

        // If it is a specific sport, load in those posts
        else {
            $.get("/post", function(data) {
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].date_posted);
                    var state = 0;
                    if (upvoted.indexOf(data[i]._id) != -1)
                        state = 1;
                    else if (downvoted.indexOf(data[i]._id) != -1)
                        state = -1
                    insertPost(postTemplate, "#post-well", data[i].title, date.format(), data[i].poster, data[i].text, data[i].score, data[i]._id, state);
                }
            });
        }

        // populate the user post well if need be
        $.get("/user/" + $("#profile-username").html() + "/posts", function(data) {
            console.log("/user/" + $("#profile-username").html() + "/posts");
            var date;
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                date = new Date(data[i].date_posted);
                var state = 0;
                if (upvoted.indexOf(data[i]._id) != -1)
                    state = 1;
                else if (downvoted.indexOf(data[i]._id) != -1)
                    state = -1
                insertPost(postTemplate, "#user-post-well", data[i].title, date.format(), data[i].poster, data[i].text, data[i].score, data[i]._id, state);
            }
        });
    });

    $("#submit-search").click(function(e) {

        // search if there is something in the search bar
        console.log($("search-bar").val());
        if ($("#search-bar").val() != null) {
            $.get("/search/" + $("#search-bar").val().split(" ")[0], function(data) {

                $("#post-well").empty();
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].date_posted);
                    var state = 0;
                    if (upvoted.indexOf(data[i]._id) != -1)
                        state = 1;
                    else if (downvoted.indexOf(data[i]._id) != -1)
                        state = -1
                    console.log(data[i]._id);
                    insertPost(postTemplate, "#post-well", data[i].title, date.format(), data[i].poster, data[i].text, data[i].score, data[i]._id, state);
                }
            })
        }
    });
});
