"use strict";




$(document).ready(function() {
    var now = new Date();
    $('.post-date').html(now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear());

    // render the correct option
    if ($("#signup").hasClass("current")) {
        ui.loginOrSignup = "signup";
        $('#signup input').first().focus();
    }
    else {
        ui.loginOrSignup = "login";
        $('#signup input').first().focus();
    }

    // handle switching between login and signup modes
    ui.switchLoginMode(); // update to whichever is showing

    $('#switch-signup').click(function() {
        ui.loginOrSignup = "signup"
        ui.switchLoginMode();
        return false;
    });
    $('#switch-login').click(function() {
        ui.loginOrSignup = "login"
        ui.switchLoginMode();
        return false;
    });

    $("#login .form-submit").click(function() {
        console.log("wefwef");
    });


    console.log(ui.loginOrSignup);
});
