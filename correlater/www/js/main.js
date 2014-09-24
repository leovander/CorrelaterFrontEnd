$(document).on('deviceready', function(){
	var $menu = $('#menu');
	var $friends = $('#friends');
	
	$menu.on('click', function(){

	});
	$friends.on('click', function(){
    window.location='invite.html';
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