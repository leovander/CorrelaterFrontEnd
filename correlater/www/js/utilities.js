$(function() {
  document.addEventListener("deviceready", function onDeviceReady() {
    checkConnection();
    checkDevice();
    window.addEventListener("batterystatus", onBatteryStatus, false);

    var available = (function () {
    var json = null;
    $.ajax({
       'async': false,
       'global': false,
       'url': 'http://e-wit.co.uk/labcrasher/COE/CECS_available.json',
       'dataType': "json",
       'success': function (data) {
           json = data;
       }
     });
     return json;
    })();

    var startDate = new Date(2014,8,9); // beware: month 0 = january, 11 = december
    var endDate = new Date(2014,8,10);
    var success = function(message) {console.log(JSON.stringify(message)); };
    var error = function(message) { alert("Error: " + message); };

    window.plugins.calendar.listEventsInRange(startDate,endDate,success,error);

    function onSuccess(events){console.log(events);}
    function onError(){console.log("No");};


  // // onSuccess Callback
  // // This method accepts a Position object, which contains the
  // // current GPS coordinates
  // //
  // var onSuccess = function(position) {
  //     alert('Latitude: '          + position.coords.latitude          + '\n' +
  //           'Longitude: '         + position.coords.longitude         + '\n' +
  //           'Altitude: '          + position.coords.altitude          + '\n' +
  //           'Accuracy: '          + position.coords.accuracy          + '\n' +
  //           'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
  //           'Heading: '           + position.coords.heading           + '\n' +
  //           'Speed: '             + position.coords.speed             + '\n' +
  //           'Timestamp: '         + position.timestamp                + '\n');
  // };
  //
  // // onError Callback receives a PositionError object
  // //
  // function onError(error) {
  //     alert('code: '    + error.code    + '\n' +
  //           'message: ' + error.message + '\n');
  // }
  //
  // navigator.geolocation.getCurrentPosition(onSuccess, onError);


  });

});


function alertDismissed() {
    alert('You are a loser');
    $("#device").html("poop");
}


//Check whether we are online or not.
function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN]  = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI]     = 'WiFi connection';
  states[Connection.CELL_2G]  = 'Cell 2G connection';
  states[Connection.CELL_3G]  = 'Cell 3G connection';
  states[Connection.CELL_4G]  = 'Cell 4G connection';
  states[Connection.CELL]     = 'Cell generic connection';
  states[Connection.NONE]     = 'No network connection';

  $("#connection").html(states[networkState]);
}

function checkDevice() {
  var platform = device.platform;
  var version = device.version;

  $("#device").html(platform + " " + version);
}

function onBatteryStatus(info) {
  $("#battery").html("Level: " + info.level + " isPlugged: " + info.isPlugged);
}
