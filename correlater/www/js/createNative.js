$(document).on('deviceready', function(){
	$('#create').submit(function (event){
		event.preventDefault();
		$.ajax({
			type: "POST",
			url: "http://e-wit.co.uk/correlater/user/createAccount",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
			if (data.message =='Account Created'){
				window.location='main.html';
				$('#feedBack').html(data.message);
			}
			$('#feedBack').html(data.message);
		});
	});
});
