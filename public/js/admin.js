"use strict"

// Table Column Names for Post and User Tables
let userTableColumnNames = ["#", "Username", "Score"];
let postTableColumnNames = ["#", "ID", "Sport", "Title", "Poster", "Date Posted"];

// Building tables here
function buildUserTable() {
    let table = document.getElementById("allusers");
    let tableColumnLength = table.rows[0].cells.length;

    for(let k = 0; k < tableColumnLength; k++) {
        table.rows[0].cells[k].innerHTML = userTableColumnNames[k];
    }
    table.style.visibility = "visible";
}

function buildPostTable() {
    let table = document.getElementById("allposts");
    let tableColumnLength = table.rows[0].cells.length;

    for(let k = 0; k < tableColumnLength; k++) {
        table.rows[0].cells[k].innerHTML = postTableColumnNames[k];
    }
    table.style.visibility = "visible";
}

function populateUserTable(data) {
    let table = document.getElementById("allusers");
    let deleteButton = document.getElementsByClassName("deleteuser");
    table.style.visibility = "visible";
    let rowCount = table.rows.length;
    for(let i = 0; i < data.length; i++) {
        let row = table.insertRow(rowCount);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        table.rows[rowCount].cells[0].innerHTML = i + 1;
        table.rows[rowCount].cells[1].innerHTML = data[i].username;
        table.rows[rowCount].cells[2].innerHTML = data[i].score;
        rowCount++;
    }
}

function populatePostTable(data) {
    let table = document.getElementById("allposts");
    let deleteButton = document.getElementsByClassName("deleteuser");
    table.style.visibility = "visible";
    let rowCount = table.rows.length;
    for(let i = 0; i < data.length; i++) {
        let row = table.insertRow(rowCount);
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        table.rows[rowCount].cells[0].innerHTML = i + 1;
        table.rows[rowCount].cells[1].innerHTML = data[i]._id;
        table.rows[rowCount].cells[2].innerHTML = data[i].sport;
        table.rows[rowCount].cells[3].innerHTML = data[i].title;
        table.rows[rowCount].cells[4].innerHTML = data[i].poster;
        table.rows[rowCount].cells[5].innerHTML = data[i].date_posted;
        rowCount++;
    }
}

function refreshTable() {
        let button1 = document.getElementById("userlist");
        let button2 = document.getElementById("postlist");
        button1.onclick = function() {
            $("#allusers").find("tr:gt(0)").remove();
        }
        button2.onclick = function() {
            $("#allposts").find("tr:gt(0)").remove();
        }
}

function changePassword(data, username, newpassword, newpassword2) {
    for(let i = 0; i < data.length; i++) {
        if(newpassword == newpassword2) {
            if(data[i].username == username) {
                data[i].password = newpassword;
            }
            else {
                alert("No such user exists with the username " + username);
            }
        }
        // passwords do not match
        else {
            alert("Passwords do not match!");
        }
    }
}


$(document).ready(function() {

    $("#getusers").submit(function(e) {
        e.preventDefault();
        $.ajax({
          url: "/admin/users/",
          type: "GET",
          success: function(data) {
              $("#allposts").hide();
              $("#allusers").show();
              buildUserTable();
              populateUserTable(data);
              refreshTable();
          }
        });
    });

    $("#changepassword").submit(function(e) {
        e.preventDefault();
        let username = $("#username").val();
        let newPassword = $("#newpassword").val();
        let newPassword2 = $("#newpassword2").val();
        if(username == "" || newPassword == "" || newPassword2 == "") {
            alert("Please make sure to fill everything.");
        }
        if(newPassword != newPassword2) {
            alert("Passwords do not match!");
        }
        $.ajax({
            url: "/admin/users",
            type: "PUT",
            data: {
                "username": username,
                "password": newPassword
            },
            success: function(data) {
                if(data == "Success") {
                    alert("You have successfully changed the password of " + username);
                }
                else {
                    alert("No such user exists with the username: " + username);
                }
                location.reload(true);
            }
        });
    });

    $("#getposts").submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: "/admin/posts/",
            type: "GET",
            success: function(data) {
                $("#allusers").hide();
                $("#allposts").show();
                buildPostTable();
                populatePostTable(data);
                refreshTable();
            }
        });
    });

    $("#removeuser").submit(function(e) {
        e.preventDefault();
        let username = $("#delusername").val();
        $.ajax({
            url: "/admin/users/" + username,
            type: "DELETE",
            success: function(data) {
                if(data == "Success") {
                    alert("You have successfully removed " + username);
                }
                else if (data == "Error"){
                    alert("No such user exists with the username: " + username);
                }
                else {
                    alert("You cannot delete an admin.");
                }
                location.reload(true);
            }
        });
    });

    $("#removepost").submit(function(e) {
        e.preventDefault();
        let postId = $("#delpost").val();
        $.ajax({
            url: "/admin/posts/" + postId,
            type: "DELETE",
            success: function(data) {
                if(data == "Success") {
                    alert("You have successfully removed post" + postId);
                }
                else {
                    alert("No such post exists with the post id: " + postId);
                }
                location.reload(true);
            }
        });
    });
});
