$(document).on('deviceready', function(){
	$('#search').submit(function (event){
		$.ajax({
			type: "POST",
			url: "http://e-wit.co.uk/correlater/user/checkUserExists",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
			if (data.message == 'User Not Found'){
				$('#feedBack').html(data.message);
				$('#submit').hide();
				$('#invite').show();
			}
			else if (data.message == 'User Found'){

			}
			$('#feedBack').html(data.message);
    		window.location='main.html';
		});
		return false;
	});
});