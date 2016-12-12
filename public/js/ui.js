"use strict";

/*  This module holds functions for updating ui elements throughout the
 *  application. All of its data can be accessed in other modules by
 *  referencing 'ui'.  This module does not handle anything related to the
 *  data of the app
 */

// namespace for ui properties
var ui = {
    profileWindowActive : false,
    postEditorActive : false
}


/**
 * Switch between login and signup views
 */
ui.switchLoginMode = function() {
    if (ui.loginOrSignup == "login") {
            $('#login').show();
            $('#login input').first().focus();
            $('#signup').hide();

    } else {
        $('#login').hide();
        $('#signup').show();
        $('#signup input').first().focus();

    }
}

/**
 * Show or hide the profile info window in the main app
 */
ui.toggleProfileWindow = function() {
    if (ui.profileWindowActive == false) {
        $("#profile-window").show();
        $('#profile-button').html('<i class="material-icons">clear</i>')
        ui.profileWindowActive = true;
    } else {
        $("#profile-window").hide();
        $('#profile-button').html('<i class="material-icons">person</i>')
        ui.profileWindowActive = false;
    }
    return false;
}

ui.togglePostEditor = function() {
    if (ui.postEditorActive == false) {
        $("#post-editor").show();
        $('#post-editor input').first().focus();
        ui.postEditorActive = true;
    } else {
        $("#post-editor").hide();
        ui.postEditorActive = false;
    }

    return false;
}

ui.closePostEditor = function() {
    $("#post-editor").hide();
    ui.postEditorActive = false;
    return false;
}
