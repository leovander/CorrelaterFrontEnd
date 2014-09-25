var pending;
var confirmed;

$(document).on('deviceready', function(){
	var requests;
	var friends;
	getRequests();
	getFriends();

	confirmed = parseInt($('#friendDivider span').html(), 10);

	$('ul').on('click', 'li', function() {
		if($(this).hasClass("pendingRequest")) {
			acceptFriend($(this).attr('id'));
			$('#friendsList').listview('refresh');
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
					$('#friendsList').append($('#' + id));
					$('#' + id + " a").addClass('received');
					pending--;
					confirmed++;
					$('#requestDivider span').html(pending);
					$('#friendDivider span').html(confirmed);
					$('#' + id + " a").removeClass('ui-icon-plus ui-icon-carat-r ui-btn-icon-right');

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

	$('#requests').listview('refresh');
}

function getRequests() {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/getRequests",
		dataType: 'json'}
	).done(function(data){
		requests = $.makeArray(data.friends);
		requests.forEach(fillRequests);
		pending = data.count;
		$('#requestDivider span').html(pending);
		$('#requests').listview('refresh');
	});
}

function fillRequests(element, index, array) {
	$('#requests').append('<li id="' + element.id + '" class="pendingRequest">' +
	'<a href="#">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '</a>' +
														 '</li>');
	$('#' + element.id + ' a').removeClass('ui-icon-carat-r').addClass('ui-icon-plus');
}

function getFriends() {
	$('#friendsList').html('');
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/getFriends",
		dataType: 'json'}
	).done(function(data){
		friends = $.makeArray(data.friends);
		friends.forEach(fillFriends);
		confirmed = data.count;
		$('#friendDivider span').html(confirmed);
		$('#friendsList').listview('refresh');
		$('#friendsList li a').removeClass('ui-icon-carat-r ui-btn-icon-right');
	});
}

function fillFriends(element, index, array) {
	$('#friendsList').append('<li id="' + element.id + '">' +
	'<a href="#">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '</a>' +
														'</li>');
}
