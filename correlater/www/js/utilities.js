$(function() {
  document.addEventListener("deviceready", function onDeviceReady() {
    checkConnection();
    checkDevice();
    window.addEventListener("batterystatus", onBatteryStatus, false);
  });
});

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
