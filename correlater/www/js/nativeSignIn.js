$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	$("form").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			}
		},
		errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		},
		submitHandler: function(form) {		
			$.ajax({
				type: "POST",
				url: "http://e-wit.co.uk/correlater/user/login",
				dataType: 'json',
				data: $(form).serialize()
			}).done(function(data){
				if(data.message == 'Logged In') {
				$('#feedBack').html(data.message);
				window.location='main.html';
			}
			$('#feedBack').html(data.message);
			});
		}
	});
});

function onDeviceReady() {
	// Now safe to use the Cordova API
}
