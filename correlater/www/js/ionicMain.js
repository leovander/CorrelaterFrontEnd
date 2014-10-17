jQuery(document).on('deviceready', function(){
  var friendsListStore;
});

angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
  $urlRouterProvider.otherwise("/event/home");
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {  
  // This code block loads the Friends Now List at start up
  jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriendsNow",
        dataType: 'json'}
    ).done(function(data){
        $scope.friendsNow = data.friends;
    })
   .always(function() {
     // Stop the ion-refresher from spinning
     $scope.$broadcast('scroll.refreshComplete');
   });

  // This code block loads the Friends List at start up
  jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/getRequests",
      dataType: 'json'}
  ).done(function(data){
    friendsListStore = data.friends;
  });
  jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/getFriends",
      dataType: 'json'}
  ).done(function(data){
      $scope.friendsList = friendsListStore.concat(data.friends);
  })
  .always(function() {
    $scope.$broadcast('scroll.refreshComplete');         
  });

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.refreshFriendsNow = function() {
  jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriendsNow",
        dataType: 'json'}
    ).done(function(data){
        $scope.friendsNow = data.friends;
    })
   .always(function() {
     // Stop the ion-refresher from spinning
     $scope.$broadcast('scroll.refreshComplete');
   });
  };

  $scope.refreshFriendsList = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getRequests",
        dataType: 'json'}
    ).done(function(data){
      friendsListStore = data.friends;
    });
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriends",
        dataType: 'json'}
    ).done(function(data){
        $scope.friendsList = friendsListStore.concat(data.friends);
    })
    .always(function() {
      $scope.$broadcast('scroll.refreshComplete');         
    });
  };

  $scope.editFriend = function(friend) {
    alert('Editting '+friend.first_name+' '+friend.last_name);
  };

  $scope.logout = function(){
    jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/logout",
      dataType: 'json',
      data: jQuery(this).serialize()}
    ).done(function(data){
        window.location='start.html';
    });
  }

  $scope.clearMood = function() {
    jQuery('#mood').val('');
  }

  $scope.updateMood = function() {
    var status = jQuery('#mood').val();
    jQuery.ajax({
      type: "POST",
      url: "http://e-wit.co.uk/correlater/user/setMood",
      dataType: 'json',
      data: {mood : status } //CHANGED THIS
    }).success(function() {
      alert("status set");
    }).always(function(){
      jQuery('#mood').val('');
    });
  }
})

// .controller('CheckinCtrl', function($scope) {

// })

// .controller('AttendeesCtrl', function($scope) {
  
// })