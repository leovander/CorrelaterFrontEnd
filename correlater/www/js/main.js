$(document).on('deviceready', function(){
	var $menu = $('#menu');
	var $friends = $('#friends');

	$menu.on('click', function(){

	});
	$friends.on('click', function(){
    window.location='invite.html';
	});

	$('#logout').click(function() {
		$.ajax({
			url: "http://e-wit.co.uk/correlater/user/logout",
			dataType: 'json',
			data: $(this).serialize()}
		).done(function(data){
				window.location='start.html';
		});
	});
});

document.addEventListener('deviceready', function(){
  $('body').bind('swipeleft',function(){
    // Add change to friend list here
    alert('Friend List');
  });
  $('body').bind('swiperight',function(){
    // Add change to menu here
    alert('Menu');
  });
},false);
