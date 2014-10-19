$(function() {
	getCalendars();
});

function getCalendars() {
	$.getJSON("http://e-wit.co.uk/correlater/google/getCalendars"
	).done(function(data){
		$.each(data.calendars, function (i, calendar) {
			$('#chooseCal').append('<label><input type="checkbox" name="'+calendar.id+'">'+calendar.name+'</label>');
		});
	});
}

$('#chooseCal').submit(function (event){
	event.preventDefault();
	// console.log($(this).serialize());
	// $.ajax({
	// 	type: "POST",
	// 	url: "http://e-wit.co.uk/correlater/google/confirmCalendars",
	// 	dataType: 'json',
	// 	data: $(this).serialize()
	// 	}).done(function(data){
	// 	console.log(data);
	// });

	$('#chooseCal').on("submit", function(event) {
		event.preventDefault();
		console.log($(this).serialize() );
	});
});
