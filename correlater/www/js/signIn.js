$(document).on('deviceready', function(){
	$('#login').submit(function (event){
		$.ajax({
			type: "POST",
			url: "http://e-wit.co.uk/correlater/user/login",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
			if (data.message == 'Logged In'){
				$('#feedBack').html(data.message);
    			window.location='main.html';
			}
			$('#feedBack').html(data.message);
		});
		return false;
	});
});