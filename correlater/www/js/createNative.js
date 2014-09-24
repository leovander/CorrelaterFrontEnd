$(document).on('deviceready', function(){
	$('#create').submit(function (event){
		event.preventDefault();
		$.ajax({
			type: "POST",
			url: "http://e-wit.co.uk/correlater/user/createAccount",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
			$('#feedBack').html(data.message);
		});
	});
});