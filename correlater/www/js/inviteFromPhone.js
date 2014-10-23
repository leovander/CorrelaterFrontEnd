$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	
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

function onDeviceReady() {
	var options      = new ContactFindOptions();
	options.multiple = true;
	options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.emails];
	var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
	navigator.contacts.find(fields, onSuccess, onError, options);
};

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

function onSuccess(contacts) {	
	contacts.forEach(function(element, index, array){
		if(element.emails) {
			var currentEmail = "";
			element.emails.forEach(function(email, pos, array) {
				if(email.type.toLowerCase() != "work") {
					if(currentEmail.length == 0) {
						currentEmail = email.value;
					}
				}
			});
			if(currentEmail.length > 0) {
				checkEmail(currentEmail, element.name.givenName, element.name.familyName);
			}
		}
	});
	$('ul').listview("refresh");
};

function compare(a, b) {
  if (a.displayName < b.displayName) {
    return -1;
  }
  if (a.displayName > b.displayName) {
    return 1;
  }
  return 0;
}

function checkEmail(email, firstName, lastName){
	$.ajax({
		type: "POST",
		url: "http://e-wit.co.uk/correlater/user/checkUserExists",
		dataType: 'json',
		data: {email: email}
	}).done(function(data){

		if(data.message == 'User Not Found') {
			$('ul').append('<li class="invitation" >' +
							'<a href="#" email="' + data.email + '">' + firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.email + '</a>' +
						   '</li>');
		}
		else if (data.message == 'Not Friends') {
			$('ul').append('<li id="'+data.user.id+'" class="request">' +
								'<a href="#">' + firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.user.email+ '</a>' +
							'</li>');
		} else if(data.message == 'Already Friends') {
			$('ul').append('<li class="friends">' +
								'<a href="#">'+ firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.user.email+'</a>' +
							'</li>');
		}
		$('ul').listview("refresh");
		$('.invitation a').removeClass('ui-icon-plus').addClass('ui-icon-mail');
		$('.friends a').removeClass('ui-icon-plus ui-btn-icon-right').addClass('received');
	});
};

function onError(contactError) {
    alert('onError!');
};