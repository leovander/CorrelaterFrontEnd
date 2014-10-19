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
          templateUrl: "templates/home.html",
          controller: 'MainCtrl'
        }
      }
    })
  $urlRouterProvider.otherwise("/event/home");
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup) {
  var rightView = 'requests';
  var invisible;
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

  // This code block loads the Requests List at start up
  jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/getRequests",
      dataType: 'json'}
  ).done(function(data){
    $scope.requestsList = data.friends;
  })
  .always(function() {
    $scope.$broadcast('scroll.refreshComplete');         
  });

  // This code block loads the Friends List at start up
  jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/getFriends",
      dataType: 'json'}
  ).done(function(data){
      $scope.friendsList = data.friends;
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

  $scope.refreshRequestsList = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getRequests",
        dataType: 'json'}
    ).done(function(data){
      $scope.requestsList = data.friends;
    })
    .always(function() {
      $scope.$broadcast('scroll.refreshComplete');         
    });
  };

  $scope.refreshFriendsList = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriends",
        dataType: 'json'}
    ).done(function(data){
        $scope.friendsList = data.friends;
    })
    .always(function() {
      $scope.$broadcast('scroll.refreshComplete');         
    });
  };

  $scope.editFriend = function(friend) {
    alert('Editting '+friend.first_name+' '+friend.last_name.substring(0,1).toUpperCase());
  };

  $scope.acceptRequest = function(friend){
    alert('Accepted '+friend.first_name+' '+friend.last_name.substring(0,1).toUpperCase());
  };

  $scope.denyRequest = function(friend){
    $ionicPopup.confirm({
      title: 'Deny '+friend.first_name+' '+friend.last_name+'?', 
      template: ''
    })
    .then(function(result){
      if (result)
      alert('Denied '+friend.first_name+' '+friend.last_name.substring(0,1).toUpperCase());
    });
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

  $scope.toggleInvisibility = function() {
    if (invisible)
      invisible=false;
    else 
      invisible=true;
    // update DB invisibility here
    alert('Toggle Invisibility Here');
  }

  $scope.getInvisibility = function() {
    return invisible;
  }

  $scope.clickFriendNow = function(id) {
    if (jQuery('#'+id).hasClass('activeNowTile'))
      jQuery('#'+id).removeClass('activeNowTile');
    else
      jQuery('#'+id).addClass('activeNowTile');
  }

  $scope.isActiveNow = function(id) {
    return jQuery('#'+id).hasClass('activeNowTile');
  }

  $scope.showRequests = function() {
    rightView='requests';
  }

  $scope.showFriends = function() {
    rightView='friends';
  }

  $scope.getRightMenu = function() {
    return rightView;
  }

  $scope.nudgeFriend = function(friend){
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<textarea ng-model="data.nudgeMessage" rows="3" placeholder="Enter message here"></textarea>',
      title: 'Nudging '+friend.first_name,
      scope: $scope,
      buttons: [
        { text: 'Nah' },
        {
          text: '<b>Nudge</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.data.nudgeMessage;
          }
        },
      ]
    });
    myPopup.then(function(res) {
      if (res)
        alert('Nudged '+friend.first_name+' with message: '+$scope.data.nudgeMessage);
    });
  }
})

// .controller('CheckinCtrl', function($scope) {

// })

// .controller('AttendeesCtrl', function($scope) {
  
// })