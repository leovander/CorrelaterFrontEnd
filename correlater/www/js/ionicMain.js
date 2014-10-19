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
  var currentUser;

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  $scope.refreshMyInfo = function() {
    jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/getMyInfo",
      dataType: 'json'
    }).done(function(data){
        if(data.message == "Logged In")
          currentUser = data.user;
        if (currentUser.status == "1")
          invisible = false;
        else
          invisible= true;
        $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function(data){
      alert('Failed getting my info');
    })
    .always(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

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
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + friend.id,
        dataType: 'json'}
    ).done(function(data) {
        if(data.message == 'Friend Accepted') {
          // Add item animation here
          alert('Success');
        } else {
          alert('Failed');
        }
    });
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
  
  //TODO: REMOVE THE CHECK MARK ONCE ADDED?
  $scope.acceptFriend = function(friend) {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + friend.id,
        dataType: 'json'
    }).done(function() {
      alert(friend.first_name + " added!");
    });
  };
  
  //TODO: REMOVE PERSON FROM THE LIST
  $scope.deleteFriend = function(friend) {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/deleteFriend/" + friend.id,
        dataType: 'json'
    }).done(function() {
      alert(friend.first_name + " deleted!");
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

  $scope.isMoodSetEmpty = function() {
    if (jQuery('#mood').val().length>0 && jQuery('#mood').val()!='')
      return true;
    return false;
  }

  $scope.updateMood = function() {
    var status = jQuery('#mood').val();
    jQuery.ajax({
      type: "POST",
      url: "http://e-wit.co.uk/correlater/user/setMood",
      dataType: 'json',
      data: {mood : status } //CHANGED THIS
    })
    .fail(function(data){
      alert('failed');
    })
    .always(function(){
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

  $scope.getMyMood = function() {
    return currentUser.mood;
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
  $scope.refreshMyInfo();
  $scope.refreshFriendsNow();
  $scope.refreshRequestsList();
  $scope.refreshFriendsList();
})

// .controller('CheckinCtrl', function($scope) {

// })

// .controller('AttendeesCtrl', function($scope) {
  
// })