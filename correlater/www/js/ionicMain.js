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

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $ionicLoading, $ionicPopover, $ionicScrollDelegate) {
  var rightView = 'requests';
  var myMood;
  var status;

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
        if(data.message == "Logged In"){
          myMood = data.user.mood;
          status = data.user.status;
        }
        $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function(data){
      alert('Failed getting my info');
    });
  }

  $scope.refreshFriendsNow = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriendsNow",
        dataType: 'json'}
    ).done(function(data){
        $scope.friendsNow = data.friends;
        $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.refreshRequestsList = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getRequests",
        dataType: 'json'}
    ).done(function(data){
      $scope.requestsList = data.friends;
      $scope.$broadcast('scroll.refreshComplete');   
    });
  };

  $scope.refreshFriendsList = function() {
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getFriends",
        dataType: 'json'}
    ).done(function(data){
      $scope.friendsList = data.friends;
      $scope.$broadcast('scroll.refreshComplete');  
    });
  };

  $scope.toggleFavorite = function(friend) {
    alert('Toggle favorite for '+friend.first_name+' '+friend.last_name.substring(0,1).toUpperCase());
  };

  $scope.acceptRequest = function(friend){
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + friend.id,
        dataType: 'json'}
    ).done(function(data) {
        if(data.message != 'Friend Accepted') {
          alert('Add Failed');
        }
        jQuery.ajax({
            url: "http://e-wit.co.uk/correlater/user/getRequests",
            dataType: 'json'}
        ).done(function(data){
          $scope.requestsList = data.friends;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
    });
  };

  $scope.denyRequest = function(friend){
    $ionicPopup.confirm({
      title: 'Deny '+friend.first_name+' '+friend.last_name+'?', 
      template: ''
    })
    .then(function(result){
      if (result){
        jQuery.ajax({
            url: "http://e-wit.co.uk/correlater/user/deleteFriend/" + friend.id,
            dataType: 'json'
        }).done(function() {
          jQuery.ajax({
              url: "http://e-wit.co.uk/correlater/user/getRequests",
              dataType: 'json'}
          ).done(function(data){
            $scope.requestsList = data.friends;
            $scope.$broadcast('scroll.refreshComplete');   
          });
        });
      }
    });
  };
  
  $scope.deleteFriend = function(friend) {
    $ionicPopup.confirm({
      title: 'Do you want to unfriend '+friend.first_name+' '+friend.last_name+'?', 
      template: ''
    })
    .then(function(result){
      if (result){
        jQuery.ajax({
            url: "http://e-wit.co.uk/correlater/user/deleteFriend/" + friend.id,
            dataType: 'json'
        }).done(function() {
          jQuery.ajax({
              url: "http://e-wit.co.uk/correlater/user/getFriends",
              dataType: 'json'}
          ).done(function(data){
            $scope.friendsList = data.friends;
            $scope.$broadcast('scroll.refreshComplete');  
          });
        });
      }
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
    myMood = jQuery('#mood').val();
    jQuery.ajax({
      type: "POST",
      url: "http://e-wit.co.uk/correlater/user/setMood",
      dataType: 'json',
      data: {mood : myMood } //CHANGED THIS
    })
    .done(function(){
      jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getMyInfo",
        dataType: 'json'
      }).done(function(data){
          if(data.message == "Logged In"){
            myMood = data.user.mood;
            status = data.user.status;
          }
          $scope.$broadcast('scroll.refreshComplete');
      });
    })
    .fail(function(data){
      alert('Failed updating mood');
    })
    .always(function(){
      jQuery('#mood').val('');
    });
  }

  $scope.setInvisibility = function(stat) {
    status=stat;
    if (status=="2") 
      $ionicLoading.show({ template: 'Free Mode', noBackdrop: true, duration: 1000 });
    else if (status=="1") 
      $ionicLoading.show({ template: 'Schedule Mode', noBackdrop: true, duration: 1000 });
    else if (status=="0") 
      $ionicLoading.show({ template: 'Invisible Mode', noBackdrop: true, duration: 1000 });
    jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/setAvailability/"+stat,
      dataType: 'json'
    }).done(function(){
      jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/getMyInfo",
        dataType: 'json'
      }).done(function(data){
          if(data.message == "Logged In")
            currentUser = data.user;
          status=currentUser.status;
            $scope.$broadcast('scroll.refreshComplete');
      })
      .fail(function(data){
        alert('Failed getting my info');
      });
    });
  }

  $scope.getInvisibility = function() {
    return status;
  }

  $scope.clickFriendNow = function(id) {
    if (jQuery('#'+id).hasClass('activeNowTile'))
      jQuery('#'+id).removeClass('activeNowTile');
    else
      jQuery('#'+id).addClass('activeNowTile');
    $scope.$broadcast('scroll.resize');
  }

  $scope.isActiveNow = function(id) {
    return jQuery('#'+id).hasClass('activeNowTile');
  }

  $scope.showRequests = function() {
    rightView='requests';
  }

  $scope.getMyMood = function() {
    return myMood;
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

  $scope.listResize = function(){
    $ionicScrollDelegate.resize();
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