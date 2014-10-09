$(function() {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/getMyInfo",
		dataType: 'json'
	}).success(function(data){
			if(data.message == "Logged In") {
				$('#feedBack').html("Welcome Back "
															+ data.user.first_name.charAt(0).toUpperCase()
															+ data.user.first_name.substring(1) + "!");
				window.location='main.html';
			}
	});

	document.addEventListener("deviceready", onDeviceReady, false);

	$('#addAccButton').on('click', function() {
		window.location='addAccount.html';
	});

	$('#signIn').on('click', function(){
		window.location='signIn.html';
	});
});

function onDeviceReady() {
	// Now safe to use the Cordova API
}
