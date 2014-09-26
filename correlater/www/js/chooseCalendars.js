$(document).on('deviceready', function(){

});


function getCalendar {
	$.ajax({
		type: "POST",
		url: "http://e-wit.co.uk/correlater/google/getCalendar",
		dataType: 'json'
		}
	).done(function(data){
		console.log(data.calendars); 
		// if (data.message == 'Logged In'){
		// 	$('#feedBack').html(data.message);
		// 		window.location='main.html';
		// }
		// $('#feedBack').html(data.message);
	});
	return false;
});