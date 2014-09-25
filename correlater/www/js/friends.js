var pending;
var confirmed;

$(document).on('deviceready', function(){
	var requests;
	getRequests();

	confirmed = parseInt($('#friendDivider span').html(), 10);

	$('ul').on('click', 'li', function() {
		if($(this).attr('class') == "pendingRequest") {
			acceptFriend($(this).attr('id'));
		}
	});
});

function acceptFriend(id) {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + id,
		dataType: 'json'}
	).done(function(data) {
		if(data.message == 'Friend Accepted') {
			$('#' + id).removeClass('pendingRequest');
			$('#' + id).fadeOut('slow', function() {
					$('#friendDivider').after($('#' + id));
					$('#' + id + " a").addClass('received');
					pending--;
					confirmed++;
					$('#requestDivider span').html(pending);
					$('#friendDivider span').html(confirmed);
					$('#' + id).fadeIn('slow', function() {
						setTimeout(function() {
							$('#' + id + " a").removeClass('received');
						}, 2000);
					});
			});
		} else {
			$('ul a').addClass('failed');
		}
	});
}

function getRequests() {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/getRequests",
		dataType: 'json'}
	).done(function(data){
		requests = $.makeArray(data.friends);
		requests.forEach(fillRequests);
		$('#requestDivider span').html(data.count);
		$('ul').listview('refresh');
		pending = parseInt($('#requestDivider span').html(), 10);
	});
}

function fillRequests(element, index, array) {
	$('#friendDivider').before('<li id="' + element.id + '" class="pendingRequest">' +
	'<a href="#">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '.</a>' +
														 '</li>');
}
