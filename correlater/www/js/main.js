$(document).on('deviceready', function(){
	$('#logout').click(function() {
		$.ajax({
			url: "http://e-wit.co.uk/correlater/user/logout",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
				window.location='start.html';
		});
	});

  var requests;
  var friends;
  $('ul').on('click', 'li', function() {
      if($(this).hasClass("pendingRequest")) {
        acceptFriend($(this).attr('id'));
        $('#friendsList').listview('refresh');
      }
  });

  $('#edit').on('click', function(){
    navigator.notification.confirm("Are you sure you want to delete "+$(this).parent().find('a').html()+"?", function(){}, "Delete friend", "Yes, No");
  });

  getFriendsNow();
});

function refresh() {
	$('#friendsNow').html('');
	getFriendsNow();
}

function getFriendsNow() {
		$.ajax({
				url: "http://e-wit.co.uk/correlater/user/getAvailable",
				dataType: 'json'}
		).done(function(data){
				var friendsNow = $.makeArray(data.friends);
				friendsNow.forEach(fillFriendsNow);
				$('#friendsNow').listview('refresh');
				$('#friendsNow li a').addClass('received').removeClass('ui-btn-icon-right ui-icon-carat-r');
		});
}

function fillFriendsNow(element, index, array) {
		$('#friendsNow').append('<li id="' + element.id + '">' +
		'<a href="#">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '</a>' +
																												'</li>');
}

document.addEventListener('deviceready', function(){
  $('#mainPage').bind('swipeleft',function(){
    // Add change to friend list here
    openFriends();
  });
  $('#mainPage').bind('swiperight',function(){
    // Add change to menu here
    openMenu();
  });
},false);

function openFriends(){
    getRequests();
    $( "#rightPanel" ).panel( "open" );
}

function openMenu(){
    $( "#leftPanel" ).panel( "open" );
}

function openInvite() {
	window.location = 'invite.html';
}

// Friend stuff//
function acceptFriend(id) {
    $.ajax({
        url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + id,
        dataType: 'json'}
    ).done(function(data) {
        if(data.message == 'Friend Accepted') {
            $('#' + id).removeClass('pendingRequest');
            $('#' + id).fadeOut('slow', function() {
                    $('#friendsList').prepend($('#' + id));
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
    $('#friendsList').html('');
    $.ajax({
        url: "http://e-wit.co.uk/correlater/user/getRequests",
        dataType: 'json'}
    ).done(function(data){
        requests = $.makeArray(data.friends);
        requests.forEach(fillRequests);
        pending = data.count;
        $('#friendsList').listview('refresh');
        $('.pendingRequest a').addClass(' ui-btn ui-btn-icon-right ui-icon-plus');
        getFriends();
    });
}

function fillRequests(element, index, array) {
    $('#friendsList').append('<li id="' + element.id + '" class="pendingRequest">' +
    '<a href="#">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '</a>' +
                                                         '</li>');
    $('#' + element.id + ' a').removeClass('ui-icon-carat-r').addClass('ui-icon-plus');
}

function getFriends() {
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
        $('.pendingRequest a').addClass(' ui-btn ui-btn-icon-right ui-icon-plus');
    });
}

function fillFriends(element, index, array) {
    $('#friendsList').append('<li id="' + element.id + '">' +
    '<a href="#" id="name">' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() +
                                                        '</li>');
}

function invite(){
    window.location='invite.html';
}






















$(document).on('deviceready', function(){
    // Swipe to remove list item
    $( document ).on( "swipeleft", "#friendsList li", function( event ) {
        var listitem = $( this );
        listitem.find('#edit').show();
        listitem.find('#edit').addClass('ui-btn-right ui-icon-gear');
    });
});