$(function() {
	getCalendars();
});

var cal;
function getCalendars() {
	jQuery.ajax({
		url: "http://e-wit.co.uk/correlater/google/getCalendars",
		dataType: "json",
		success: function (data){
			cal = data;
			console.log("cal ONLY");
			console.log(cal);

			$.each(data.calendars, function (i, calendar) {
				$('#chooseCal').append('<label><input type="checkbox" name="'+calendar.id+'">'+calendar.name+'</label>');
			});

			$('#chooseCal').submit(function(event) {
				event.preventDefault();
				var selectedCal = [];
				$('input:checked').each(function(){
					selectedCal.push($(this).attr('name'));
				});
				console.log("selected CALENDAR");
				console.log(selectedCal);
				//var jsonCal = JSON.stringify(selectedCal);
				// console.log(jsonCal);
				jQuery.ajax({
					type: "POST",
					url: 'http://e-wit.co.uk/gyngai/google/confirmCalendars',
					data: {id: selectedCal},
					dataType: 'json',
					complete: function (data) {
						if (data.responseText == "{\"message\":\"Calendar confirmation succeed\"}") {
							console.log("confirm calendar success");


							jQuery.ajax({
								url: 'http://e-wit.co.uk/gyngai/google/pullEvents',
								dataType:'json',
								success: function (data){
									//if(data.message == 'Pull events succeed') {
										console.log("Pull events succeed");
									//} else {
										//console.log("Pull events fail");
									//}
								}
							});

						} else {
							console.log("confirm calendar succeed");
						}
					}
				});
			});
		}
	});
}




