$(function() {
	



	document.addEventListener("deviceready", onDeviceReady, false);

});

function onDeviceReady() {
	var options      = new ContactFindOptions();
	options.multiple = true;
	options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.emails];
	var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
	navigator.contacts.find(fields, onSuccess, onError, options);
};

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
};

function checkEmail(email, firstName, lastName){
	$.ajax({
		type: "POST",
		url: "http://e-wit.co.uk/correlater/user/checkUserExists",
		dataType: 'json',
		data: {email: email}
	}).done(function(data){

		if(data.message == 'User Not Found') {

				$('ul').append('<li class="invitation" >' +
													'<a href="#">' + firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.email + '</a>' +
												'</li>');
				$('ul').listview("refresh");
				$('ul li a').removeClass('ui-icon-plus').addClass('ui-icon-mail');
		}
		else if (data.message == 'Not Friends') {

				if(data.user.valid == 0) {
				$('ul').append('<li id="'+data.user.id+'" class="request">' +
														'<a href="#">'+ firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.user.email+'</a>' +
													'</li>');
				} else {
					$('ul').append('<li id="'+data.user.id+'" class="request">' +
														'<a href="#">'+ firstName + ' ' + lastName.substring(0, 1).toUpperCase() +'</a>' +
													'</li>');
				}
				$('ul').listview("refresh");
		} else if(data.message == 'Already Friends') {

				if(data.user.valid == 0) {
					$('ul').append('<li id="'+data.user.id+'">' +
														'<a href="#">'+ firstName + ' ' + lastName.substring(0, 1).toUpperCase() + ' ' + data.user.email+'</a>' +
													'</li>');
				} else {
					$('ul').append('<li id="'+data.user.id+'">' +
														'<a href="#">'+ firstName + ' ' + lastName.substring(0, 1).toUpperCase()+'</a>' +
													'</li>');
				}
				$('ul').listview("refresh");
				$('ul li a').removeClass('ui-icon-plus ui-btn-icon-right').addClass('received');
		}
	});
};

function onError(contactError) {
    alert('onError!');
};