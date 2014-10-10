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


  getFriendsNow();
});

function refresh() {
	$('#friendsNow').html('');
	getFriendsNow();
}

function getFriendsNow() {
		$.ajax({
				url: "http://e-wit.co.uk/correlater/user/getFriendsNow",
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
        '<p>' + 'Friend Status Here -----------------------------------' + '</p>' +
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
    '<h3>' + element.first_name + ' ' + element.last_name.substring(0,1).toUpperCase() + '</h3>' +
                                                        '</li>');
}

function invite(){
    window.location='invite.html';
}






















$(document).on('deviceready', function(){
    // Swipe to remove list item
    $( document ).on( "swipeleft swiperight", "#friendsList li", function( event ) {
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition );
    });
    // If it's not a touch device...
    if ( ! $.mobile.support.touch ) {
        // Remove the class that is used to hide the delete button on touch devices
        $( "#friendsList" ).removeClass( "touch" );
        // Click delete split-button to remove list item
        $( ".delete" ).on( "click", function() {
            var listitem = $( this ).parent( "li" );
            confirmAndDelete( listitem );
        });
    }
    function confirmAndDelete( listitem, transition ) {
        // Highlight the list item that will be removed
        listitem.addClass( "ui-btn-down-d" );
        // Inject topic in confirmation popup after removing any previous injected topics
        $( "#confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup

        alert('Want to delete?');
        // $( "#confirm" ).popup( "open" );
        // // Proceed when the user confirms
        // $( "#confirm #yes" ).on( "click", function() {
        //     // Remove with a transition
        //     if ( transition ) {
        //         listitem
        //             // Remove the highlight
        //             .removeClass( "ui-btn-down-d" )
        //             // Add the class for the transition direction
        //             .addClass( transition )
        //             // When the transition is done...
        //             .on( "webkitTransitionEnd transitionend otransitionend", function() {
        //                 // ...the list item will be removed
        //                 listitem.remove();
        //                 // ...the list will be refreshed and the temporary class for border styling removed
        //                 $( "#friendsList" ).listview( "refresh" ).find( ".border" ).removeClass( "border" );
        //             })
        //             // During the transition the previous list item should get bottom border
        //             .prev( "li" ).addClass( "border" );
        //     }
        //     // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
        //     else {
        //         listitem.remove();
        //         $( "#friendsList" ).listview( "refresh" );
        //     }
        // });
        // // Remove active state and unbind when the cancel button is clicked
        // $( "#confirm #cancel" ).on( "click", function() {
        //     listitem.removeClass( "ui-btn-down-d" );
        //     $( "#confirm #yes" ).off();
        // });
    }
});