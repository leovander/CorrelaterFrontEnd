$(document).on('deviceready', function() {
	$("form").validate({
		rules: {
			email: {
				required: true,
				email: true
			}
		},
		errorPlacement: function( error, element ) {
			error.insertAfter( element.parent() );
		},
		submitHandler: function(form) {		
			$.ajax({
				type: "POST",
				url: "http://e-wit.co.uk/correlater/user/checkUserExists",
				dataType: 'json',
				data: $(form).serialize()}
			).done(function(data){
				if(data.message == 'User Not Found') {
					if($('ul').children().length == 1) {
						$('ul').fadeOut(function() {
							$('ul').html('');
						});
					}
	
					$('ul').fadeIn(function() {
						$('ul').append('<li class="invitation" >' +
															'<a href="#">' + data.email + '</a>' +
														'</li>');
						$('ul').listview("refresh");
						$('ul li a').removeClass('ui-icon-plus').addClass('ui-icon-mail');
					});
				}
				else if (data.message == 'Not Friends') {
					if($('ul').children().length == 1) {
						$('ul').fadeOut(function() {
							$('ul').html('');
						});
					}
	
					$('ul').fadeIn(function() {
						if(data.user.valid == 0) {
						$('ul').append('<li id="'+data.user.id+'" class="request">' +
																'<a href="#">'+data.user.email+'</a>' +
															'</li>');
						} else {
							$('ul').append('<li id="'+data.user.id+'" class="request">' +
																'<a href="#">'+data.user.first_name+'</a>' +
															'</li>');
						}
						$('ul').listview("refresh");
					});
				} else if(data.message == 'Already Friends') {
					if($('ul').children().length == 1) {
						$('ul').fadeOut(function() {
							$('ul').html('');
						});
					}
	
					$('ul').fadeIn(function() {
						if(data.user.valid == 0) {
							$('ul').append('<li id="'+data.user.id+'">' +
																'<a href="#">'+data.user.email+'</a>' +
															'</li>');
						} else {
							$('ul').append('<li id="'+data.user.id+'">' +
																'<a href="#">'+data.user.first_name+'</a>' +
															'</li>');
						}
						$('ul').listview("refresh");
						$('ul li a').removeClass('ui-icon-plus ui-btn-icon-right').addClass('received');
					});
				}
			});
		}
	});

	$('ul').on('click', 'li', function() {
		if($(this).hasClass('request')) {
			addFriend($(this).attr('id'));
		} else if($(this).hasClass('invitation')) {
			inviteFriend($(this).find('a').html());
		}
	});
});

function addFriend(id) {
	$.ajax({
		url: "http://e-wit.co.uk/correlater/user/addFriend/" + id,
		dataType: 'json'}
	).done(function(data) {
		if(data.message == 'Request Sent') {
			$('ul li').removeClass('request');
			$('ul a').addClass('received').removeClass('ui-icon-plus ui-btn-icon-right');
		} else {
			$('ul a').addClass('failed');
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
			$('ul li').removeClass('invitation');
			$('ul a').addClass('received').removeClass('ui-icon-plus ui-btn-icon-right');
		} else {
			$('ul a').addClass('failed');
		}
	});
}
