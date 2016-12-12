//stubhub event IDs, fetched these from browser
var NBA = ["9640976", "9640809", "9640980", "9640250", "9640983", "9641371"];
var NHL = ["9606422", "9606247", "9606430", "9606437", "9606444", "9606447"];
var NFL = ["9566739", "9566801", "9566766", "9566686", "9566581", "9566651"];
var MLB = ["9715905", "9715906", "9721588", "9721589", "9721590", "9721591"];
var PGA = ["9654976", "9654977", "9654978", "9654979", "9654980", "9654981"];

//array containing xml returned from api calls
var NBA_doc = [];
var NHL_doc = [];
var NFL_doc = [];
var MLB_doc = [];
var PGA_doc = [];

//array containing json objects with 3 fields
//location - place of event
//event_title - name of event
//url - link to buy tickets
var NBA_info = [];
var NHL_info = [];
var NFL_info = [];
var MLB_info = [];
var PGA_info = [];

//delay function to avoid surpassing API call limit (10/minute)
function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}



//Login multiple times and fetch data from stubhub api for each event
$(document).ready(function() {

    //login header
    var authHeaders = {
        Authorization: "Basic " + "RDBmZVlsYkVnQURfYjFmSEJHR0YwYWx2bUZjYTo5dGxWR3lSNnBaZklNako1WTMyTEo5NmxaWThh",
    };

    //login and get event info for NBA events
    $.ajax({
        method: 'POST',
        url: "https://api.stubhub.com/login",
        headers: authHeaders,
        data: {
            grant_type: 'password',
            username: 'sudipto.arif@mail.utoronto.ca',
            password: 'abcd1234',
            scope: 'SANDBOX'
        }
    }).then(function(data) {
        $.ajaxSetup({beforeSend: function (xhr)
        {
           xhr.setRequestHeader("Authorization","Bearer " + "7DIbCFu0NGYUlHgREOLWfpfzrD8a");
        }
    });
    }).then(function() {
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + NBA[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NBA[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NBA[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NBA[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NBA[4]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NBA[5]))
            .then(function() {
                NBA_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));


                //parse XML data
                var i = 0;
                for(i = 0; i != NBA_doc[0].length ; i++)
                {

                    var response = NBA_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    NBA_info.push(ret);
                }

               console.log(NBA_info);
            });

        //wait for a while to avoid sending too many requests
        sleep(20000);
    });


    $.ajax({
        method: 'POST',
        url: "https://api.stubhub.com/login",
        headers: authHeaders,
        data: {
            grant_type: 'password',
            username: 'sudipto.arif@mail.utoronto.ca',
            password: 'abcd1234',
            scope: 'SANDBOX'
        }
    }).then(function(data) {
        $.ajaxSetup({beforeSend: function (xhr)
        {
           xhr.setRequestHeader("Authorization","Bearer " + "7DIbCFu0NGYUlHgREOLWfpfzrD8a");
        }
    });
    }).then(function() {
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + NHL[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NHL[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NHL[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NHL[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NHL[4]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NHL[5]))
            .then(function() {
                NHL_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));


                //parse XML data
                var i = 0;
                for(i = 0; i != NHL_doc[0].length ; i++)
                {

                    var response = NHL_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    NHL_info.push(ret);
                }

               console.log(NHL_info);
            });

        //wait for a while to avoid sending too many requests
        sleep(20000);
    });


    $.ajax({
        method: 'POST',
        url: "https://api.stubhub.com/login",
        headers: authHeaders,
        data: {
            grant_type: 'password',
            username: 'sudipto.arif@mail.utoronto.ca',
            password: 'abcd1234',
            scope: 'SANDBOX'
        }
    }).then(function(data) {
        $.ajaxSetup({beforeSend: function (xhr)
        {
           xhr.setRequestHeader("Authorization","Bearer " + "7DIbCFu0NGYUlHgREOLWfpfzrD8a");
        }
    });
    }).then(function() {
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + NFL[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NFL[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NFL[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NFL[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NFL[4]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + NFL[5]))
            .then(function() {
                NFL_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));


                //parse XML data
                var i = 0;
                for(i = 0; i != NFL_doc[0].length ; i++)
                {

                    var response = NFL_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    NFL_info.push(ret);
                }

               console.log(NFL_info);
            });

        //wait for a while to avoid sending too many requests
        sleep(20000);
    });

    $.ajax({
        method: 'POST',
        url: "https://api.stubhub.com/login",
        headers: authHeaders,
        data: {
            grant_type: 'password',
            username: 'sudipto.arif@mail.utoronto.ca',
            password: 'abcd1234',
            scope: 'SANDBOX'
        }
    }).then(function(data) {
        $.ajaxSetup({beforeSend: function (xhr)
        {
           xhr.setRequestHeader("Authorization","Bearer " + "7DIbCFu0NGYUlHgREOLWfpfzrD8a");
        }
    });
    }).then(function() {
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + PGA[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + PGA[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + PGA[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + PGA[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + PGA[4]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + PGA[5]))
            .then(function() {
                PGA_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));


                //parse XML data
                var i = 0;
                for(i = 0; i != PGA_doc[0].length ; i++)
                {

                    var response = PGA_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    PGA_info.push(ret);
                }

               console.log(PGA_info);
            });

        //wait for a while to avoid sending too many requests
        sleep(30000);
    });

    $.ajax({
        method: 'POST',
        url: "https://api.stubhub.com/login",
        headers: authHeaders,
        data: {
            grant_type: 'password',
            username: 'sudipto.arif@mail.utoronto.ca',
            password: 'abcd1234',
            scope: 'SANDBOX'
        }
    }).then(function(data) {
        $.ajaxSetup({beforeSend: function (xhr)
        {
           xhr.setRequestHeader("Authorization","Bearer " + "7DIbCFu0NGYUlHgREOLWfpfzrD8a");
        }
    });
    }).then(function() {
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + MLB[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + MLB[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + MLB[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + MLB[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + MLB[4]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + MLB[5]))
            .then(function() {
                MLB_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));


                //parse XML data
                var i = 0;
                for(i = 0; i != MLB_doc[0].length ; i++)
                {

                    var response = MLB_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    MLB_info.push(ret);
                }

               console.log(MLB_info);
            });

        //wait for a while to avoid sending too many requests
        sleep(30000);
    });

});
