$(function() {
	$('ul').on('click', 'li', function() {
		if($(this).hasClass('request')) {
			$(this).addClass('requestSent');
			addFriend($(this).attr('id'));
		} else if($(this).hasClass('invitation')) {
			$(this).addClass('inviteSent');
			inviteFriend($(this).find('a').attr('email'));
		}
	});
});



function addFriend(id) {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/addFriend/" + id,
		dataType: 'json'}
	).done(function(data) {
		if(data.message == 'Request Sent') {
			$('.requestSent').removeClass('request');
			$('.requestSent a').addClass('received').removeClass('ui-icon-plus ui-btn-icon-right');
		} else {
			$('.requestSent a').addClass('failed');
		}
	});
}

function inviteFriend(friendEmail) {
	var params = { email: friendEmail };
	$.ajax({
		type: 'POST',
		url: "http://e-wit.co.uk/correlater/user/sendInvite",
		dataType: 'json',
		data: params
	}).done(function(data) {
		if(data.message == 'Sent') {
			$('.inviteSent').removeClass('invitation');
			$('.inviteSent a').addClass('received').removeClass('ui-icon-plus ui-icon-mail ui-btn-icon-right');
		} else {
			$('.inviteSent a').addClass('failed');
		}
	});
}

$(function() {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/google/getContacts",
		dataType: 'json'
	}).done(function(data) {
		data.emails.forEach(function(element, index, array) {
			checkEmail(element.email, element.firstName, element.lastInitial);
		});
		$('ul').listview("refresh");
	});
});

function checkEmail(email, firstName, lastInitital){
	$.ajax({
		type: "POST",
		url: "http://e-wit.co.uk/correlater/user/checkUserExists",
		dataType: 'json',
		data: {email: email}
	}).done(function(data){

		if(data.message == 'User Not Found') {
			$('ul').append('<li class="invitation" >' +
							'<a href="#" email="' + data.email + '">' + firstName + ' ' + lastInitital + ' ' + data.email + '</a>' +
						   '</li>');
		}
		else if (data.message == 'Not Friends') {
			$('ul').append('<li id="'+data.user.id+'" class="request">' +
								'<a href="#">' + firstName + ' ' + lastInitital + ' ' + data.user.email+ '</a>' +
							'</li>');
		} else if(data.message == 'Already Friends') {
			$('ul').append('<li class="friends">' +
								'<a href="#">'+ firstName + ' ' + lastInitital + ' ' + data.user.email+'</a>' +
							'</li>');
		}
		$('ul').listview("refresh");
		$('.invitation a').removeClass('ui-icon-plus').addClass('ui-icon-mail');
		$('.friends a').removeClass('ui-icon-plus ui-btn-icon-right').addClass('received');
	});
};