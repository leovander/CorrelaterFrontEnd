document.addEventListener('deviceready', function(){
  $('body').bind('swipeleft',function(){
    // Add change to menu here
    alert('Menu');
  });
  $('body').bind('swiperight',function(){
    // Add change to friend list here
    alert('Friend List');
  });
},false);