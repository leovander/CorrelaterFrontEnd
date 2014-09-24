$(document).on('deviceready', function(){
	$('#login').submit(function (event){
		$.ajax({
			type: "POST",
			url: "http://e-wit.co.uk/correlater/user/login",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
			$('#feedBack').html(data.message);
    		window.location='main.html';
		});
		return false;
	});
});