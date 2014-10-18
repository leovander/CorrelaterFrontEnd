$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	
	$("form").validate({
		rules: {
			first_name: {
				required: true	
			},
			last_name: {
				required: true	
			},
			last_name: {
				required: true	
			},
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			},
			verify_password: {
		    	required: true,
		    	equalTo: "#password"
		    }
		},
		errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		},
		submitHandler: function(form) {		
			$.ajax({
				type: "POST",
				url: "http://e-wit.co.uk/correlater/user/createAccount",
				dataType: 'json',
				data: $(form).serialize()
			}).done(function(data){
				if (data.message =='Account Created'){
					window.location='main.html';
					$('#feedBack').html(data.message);
				}
				$('#feedBack').html(data.message);
			});
		}
	});
});

function onDeviceReady() {
	// Now safe to use the Cordova API
}
