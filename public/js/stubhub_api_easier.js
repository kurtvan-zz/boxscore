
//stubhub event IDs, fetched these from browser
var event_array = ["9640976", "9606422", "9566739", "9715905", "9654976"];
var event_doc = [];

var event_info = [];

//delay function to avoid surpassing API call limit (10/minute)
function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

//Login and fetch data from stubhub api for each event
var getData = function() {

    //login header
    var authHeaders = {
        Authorization: "Basic " + "RDBmZVlsYkVnQURfYjFmSEJHR0YwYWx2bUZjYTo5dGxWR3lSNnBaZklNako1WTMyTEo5NmxaWThh",
    };

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
        $.when($.get("https://api.stubhub.com/catalog/events/v2/" + event_array[0]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + event_array[1]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + event_array[2]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + event_array[3]),
            $.get("https://api.stubhub.com/catalog/events/v2/" + event_array[4]))
            .then(function() {
                event_doc.push([].slice.apply(arguments, [0]).map(function(result) {
                    //get xml document returned by API
                    return result[0];
                }));

                //parse XML data
                var i = 0;
                for(i = 0; i != event_doc[0].length ; i++)
                {

                    var response = event_doc[0][i];
                    var event_title = $( response.getElementsByTagName("title")[0] ) .text();
                    var location = $( response.getElementsByTagName("venue")[0].getElementsByTagName("name")[0] ).text() + ", " +
                                       $( response.getElementsByTagName("venue")[0].getElementsByTagName("city")[0] ).text() ;
                    var url = "https://www.stubhub.com/" + $( response.getElementsByTagName("eventUrl")[0] ) .text();

                    //store data members into object
                    var ret = {};
                    ret.location = location;
                    ret.event_title = event_title;
                    ret.url = url;

                    //push to array
                    event_info.push(ret);
                }

                for (var i = 0; i < event_info.length; i++) {
                    var newEvent = "<li>" + "<p>" + event_info[i].event_title +
                     "</p>" + "<p>" + event_info[i].location + "</p>" + "<a href=" + event_info[i].url +
                     ">Buy Tickets</a></li>";
                    $("#events-list ul").append(newEvent);
                }
            });
    });
};

$(document).ready(function() {
    $("#show-events").click(function() {
        $("#events-list").toggle();
        if (event_info.length == 0) {
            getData();
        }
    })
});
