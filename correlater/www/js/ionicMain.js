document.addEventListener('deviceready', function () {
    // Enable background mode
    cordova.plugins.backgroundMode.configure({ text:'Nudge Retrieval Service.'});
    cordova.plugins.backgroundMode.enable();
    // Android customization
    window.plugin.notification.local.promptForPermission();

}, false);

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

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $ionicPopup, $ionicLoading, $ionicPopover, $ionicScrollDelegate, $ionicModal) {
  var inputLaterDate=0, inputLaterTime=0;
  var rightView = 'requests';
  var mainView = 'now';
  var myMood;
  var status;
  var isFB = false;
  var isGoogle = false;

  window.setInterval(function() {getMyInfo(); getRequests(); getNudges();}, 10000);

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  function getMyInfo(){
    jQuery.ajax({
      type: "GET",
      url: "http://e-wit.co.uk/correlater/user/getMyInfo",
      dataType: 'json'
    }).done(function(data){
        if(data.message == "Logged In"){
          myMood = data.user.mood;
          status = data.status;
          if(data.facebook=="Facebook User")
            isFB=true;
        }
        $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function(data){
      // $ionicLoading.show({ template: 'Check network connection', noBackdrop: false, duration: 1000 });
    });
  }

  $scope.refreshMyInfo = function() {
    $scope.Math = window.Math;
    getMyInfo();
  }

  function getAvailable(){
    jQuery.ajax({
        type: "GET",
        url: "http://e-wit.co.uk/correlater/user/getAvailableV2",
        dataType: 'json'}
    ).done(function(data){
      var tTime, tHour, tMin;
        for (var i=0; i<data.friends.length; i++){
          tTime=data.friends[i].remaining;
          if (tTime=='8888'||tTime=='9999') data.friends[i].remaining='Free Now';
          else {
            tHour=('0'+Math.floor(tTime/60)).slice(-2);
            tMin=('0'+tTime%60).slice(-2);
            data.friends[i].remaining=tHour+':'+tMin;
          }
        }
        $scope.friendsNow = data.friends;
        $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function(data){
      $ionicLoading.show({ template: 'List refresh failed', noBackdrop: false, duration: 1000 });
    });
  }

  $scope.refreshFriendsNow = function() {
    getAvailable();
  };

  function getAvailableLater(){
    if (typeof jQuery('#laterDate').val()!='undefined'||typeof jQuery('#laterTime').val()!='undefined'){
      inputLaterDate=jQuery('#laterDate').val().toString();
      inputLaterTime=jQuery('#laterTime').val().toString();
    }
    jQuery.ajax({
        type: "POST",
        url: "http://e-wit.co.uk/correlater/user/getAvailableFuture",
        dataType: 'json',
        data: {
          date: inputLaterDate,
          time: inputLaterTime
        }
      }
    ).done(function(data){
        $scope.friendsLater = data.friends;
        $scope.$broadcast('scroll.refreshComplete');
    })
    .fail(function(data){
      $ionicLoading.show({ template: 'List refresh failed', noBackdrop: false, duration: 1000 });
    });
  }

  $scope.refreshFriendsLater = function(){
    getAvailableLater();
  }

  function getRequests(){
    jQuery.ajax({
        type: "GET",
        url: "http://e-wit.co.uk/correlater/user/getRequests",
        dataType: 'json'}
    ).done(function(data){
	  if($scope.requestsList.length < data.count)
      {
          if(window.hasOwnProperty('plugin')) {
            var newRequests = (data.count - $scope.requestsList.length);
            var newNudgeMessage = 'You have ' + newRequests + ' new Request!';
            if(newRequests > 1) {
              newNudgeMessage = 'You have ' + newRequests + ' new Requests!';
            }
            window.plugin.notification.local.add({ message: newNudgeMessage});
          }
      }
      
      $scope.requestsList = data.friends;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.refreshRequestsList = function() {
    getRequests();
  };

  function getNudges(){
    jQuery.ajax({
      type: "GET",
      url: "http://e-wit.co.uk/correlater/user/getNudges",
      dataType: 'json'}
    ).done(function(data)
    {
      //window.plugin.notification.local.promptForPermission();
      if($scope.nudgesList.length < data.count)
      {
          if(window.hasOwnProperty('plugin')) {
            var newNudges = (data.count - $scope.nudgesList.length);
            var newNudgeMessage = 'You have ' + newNudges + ' new Nudge!';
            if(newNudges > 1) {
              newNudgeMessage = 'You have ' + newNudges + ' new Nudges!';
            }
            window.plugin.notification.local.add({ message: newNudgeMessage});
          }
      }
      $scope.nudgesList=data.nudges;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.refreshNudgesList = function(){
    getNudges();
  }

  function getFriends(){
    jQuery.ajax({
        type: "GET",
        url: "http://e-wit.co.uk/correlater/user/getFriends",
        dataType: 'json'}
    ).done(function(data){
      $scope.friendsList = data.friends;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.refreshFriendsList = function() {
    getFriends();
  };

  function setFavorite(friend){
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/setFavorite/"+friend.id,
        dataType: 'json'}
    ).done(function(data){
      getFriends();
    });    
  }

  $scope.toggleFavorite = function(friend) {
    setFavorite(friend);
  };

  function acceptFriend(friend){
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/acceptFriend/" + friend.id,
        dataType: 'json'}
    ).done(function(data) {
      if(data.message != 'Friend Accepted') {
        alert('Add Failed');
      }
      getRequests();
    });    
  }

  $scope.acceptRequest = function(friend){
    acceptFriend(friend);
  };

  function deleteFriend(friend){
    jQuery.ajax({
        url: "http://e-wit.co.uk/correlater/user/deleteFriend/" + friend.id,
        dataType: 'json'
    }).done(function() {
      getRequests();
      getFriends();
    });
  }

  $scope.denyRequest = function(friend){
    $ionicPopup.confirm({
      title: 'Deny '+friend.first_name+' '+friend.last_name+'?',
      template: ''
    })
    .then(function(result){
      if (result){
        deleteFriend(friend);
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
        deleteFriend(friend);
      }
    });
  };

  $scope.logout = function(){
    localStorage.clear();
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
      getMyInfo();
    })
    .fail(function(data){
      $ionicLoading.show({ template: 'Check network connection', noBackdrop: false, duration: 1000 });
    })
    .always(function(){
      jQuery('#mood').val('');
    });
  }
  $scope.setInvisibility = function(stat) {
    var oldStatus=status;
    var maxIntervalTime=180;
    var interval=0;
    var share=false;
    status=stat;
    var buttonsTemplate;
    var rangeTemplate = '<div class="range"><input id="timeRange" type="range" name="volume" min="0" max="180" step="15" ng-model="data.interval"></div><p ng-if="data.interval">{{Math.floor(data.interval/60)}} Hours and {{data.interval%60}} Minutes</p><p ng-if="!data.interval">'+Math.floor(maxIntervalTime/2/60)+' Hours and '+maxIntervalTime/2%60+' Minutes</p><p class="thered" ng-if="data.interval==0">Forever</p>';
    if (isFB)
      buttonsTemplate=[
        { 
          text: 'No',
          onTap: function(e){
            status=oldStatus;
          } 
        },
        {
          text: 'Share',
          type: 'button-positive',
          onTap: function(e){
            share=true;
            interval=jQuery("#timeRange").val();
            return jQuery("#timeRange").val();
          }
        },
        {
          text: '<b>Go!</b>',
          type: 'button-balanced',
          onTap: function(e) {
            interval=jQuery("#timeRange").val();
            return jQuery("#timeRange").val();
          }
        },
      ];
    else
      buttonsTemplate=[
        { 
          text: 'No',
          onTap: function(e){
            status=oldStatus;
          } 
        },
        {
          text: '<b>Go!</b>',
          type: 'button-balanced',
          onTap: function(e) {
            interval=jQuery("#timeRange").val();
            return jQuery("#timeRange").val();
          }
        },
      ];
    
    // This if statement disables pressing the same button
    if (oldStatus!=status){
      if (status=="2"){
        var myPopup = $ionicPopup.show({
          template: rangeTemplate,
          title: 'Set free mode time',
          scope: $scope,
          buttons: buttonsTemplate
        });
        myPopup.then(function(res) {
          if (res){
            if (share&&isFB)
              if (interval==0)
                shareFB("I'm free to hang out right now!");
              else
                shareFB("I'm free to hang out until "+new Date((new Date()).getTime()+interval*60000).toLocaleTimeString()+"!");
            $ionicLoading.show({ template: 'Free Mode', noBackdrop: true, duration: 1000 }); 
            setTimeAvailability(status,interval);
          }      
        });
      }
      else if (status=="1"){
        interval=0;
        $ionicLoading.show({ template: 'Schedule Mode', noBackdrop: true, duration: 1000 });
        setTimeAvailability(status,interval);
      }
      else if (status=="0"){
        var myPopup = $ionicPopup.show({
          template: rangeTemplate,
          title: 'Set invisible mode time',
          scope: $scope,
          buttons: buttonsTemplate
        });
        myPopup.then(function(res) {
          if (res){
            if (share&&isFB)
              if (interval==0)
                shareFB("I'm busy and can't hang out right now");
              else
                shareFB("I'm busy and can't hang out for "+interval+" minutes.");
            $ionicLoading.show({ template: 'Invisible Mode', noBackdrop: true, duration: 1000 }); 
            setTimeAvailability(status,interval);
          }      
        });
      }
    }
    else 
      if (status=="2"||status=="0") displayTimeLeft();
  }

  function displayTimeLeft(){
    jQuery.ajax({
      type: "GET",
      url: "http://e-wit.co.uk/correlater/user/checkAvailability",
      dataType: 'json'
    }).done(function(data){
      var stat = data.status;
      var time = data.remaining_time;
      var modeType;
      if (stat=="2")
        modeType="Free";
      else if (stat=="0")
        modeType="Invisible";
      if (time==-1)
        $ionicLoading.show({ template: modeType+' Mode', noBackdrop: false, duration: 1000 });
      else
        $ionicLoading.show({ template: time+' minutes in '+modeType+' Mode', noBackdrop: false, duration: 1000 });
    });
  }

  function setTimeAvailability(statusVar, interval){
    jQuery.ajax({
      type: "POST",
      url: "http://e-wit.co.uk/correlater/user/setTimeAvailability",
      dataType: 'json',
      data: {
        status: parseInt(statusVar, 10),
        time: parseInt(interval, 10)
      }
    }).done(function(){
      getMyInfo();
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

  $scope.getMyMood = function() {
    if (myMood.length!=0)
      return myMood;
    return "Update your mood";
  }

  $scope.showNow = function() {
    mainView='now';
  }

  $scope.showLater = function() {
    mainView='later';
  }

  $scope.getMainView = function(){
    return mainView;
  }

  $scope.showRequests = function() {
    rightView='requests';
    getRequests();
  }

  $scope.showNudges = function() {
    rightView='nudges';
    getNudges();
  }

  $scope.showFriends = function() {
    rightView='friends';
    getFriends();
  }

  $scope.getRightMenu = function() {
    return rightView;
  }

  function setNudges(friend, mess){
    jQuery.ajax({
      type: "POST",
      url: "http://e-wit.co.uk/correlater/user/setNudges",
      dataType: 'json',
      data: {
        receiver_id: friend.id,
        message: mess
      }
    }).done(function(){
      $ionicLoading.show({ template: 'Nudge Sent', noBackdrop: true, duration: 1000 });
      getNudges();
    });
  }

  function deleteNudge(friend){
    jQuery.ajax({
      url: "http://e-wit.co.uk/correlater/user/deleteNudge/"+friend.id,
      dataType: 'json'
    }).done(function(){
      getNudges();
    });
  }

  $scope.removeNudge = function(friend){
    deleteNudge(friend);
  }

  $scope.nudgeFriend = function(friend){
    $scope.data = {}
    var myPopup = $ionicPopup.show({
      template: '<textarea ng-model="data.nudgeMessage" rows="3" placeholder="Enter message here"></textarea>',
      title: 'Nudging '+friend.first_name,
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Nudge</b>',
          type: 'button-positive',
          onTap: function(e) {
            return ''+$scope.data.nudgeMessage;
          }
        },
      ]
    });
    myPopup.then(function(res) {
      if (res)
        if (typeof $scope.data.nudgeMessage!=='undefined'){
          setNudges(friend,$scope.data.nudgeMessage);
        }
        else {
          setNudges(friend,'');
        }
    });
  }

  $scope.listResize = function(){
    $ionicScrollDelegate.resize();
  }

  $scope.getSearchFriend = function(){
    return jQuery('#searchFriend').val();
  }

  $scope.isSearchFriendEmpty = function(){
    if (jQuery('#searchFriend').val().length>0 && jQuery('#searchFriend').val()!='')
      return true;
    return false;
  }

  $scope.clearSearchFriend = function(){
    jQuery('#searchFriend').val('');
  }

  // Function to share on facebook
  function shareFB(msg) {
    jQuery.post(
  		"https://graph.facebook.com/v2.2/"+localStorage.getItem("fbid")+"/feed",
  		{
  			message: msg,
  			name: "Corral",
  			link: "http://e-wit.co.uk/correlate/",
  			picture: "http://e-wit.co.uk/correlate/img/logo.png",
  			description: "Helping people get together at anytime with less hassle!",
  			caption: "Join Corral today!",
  			access_token: localStorage.getItem("fbtoken")
  		});
  }
  
  function shareGoogle(msg, id, token) {
	jQuery.post(
  		"https://www.googleapis.com/plus/v1/people/me/moments/vault",
  		{
  			access_token: token,
  			key: "514788609244-129u3h2nrdqrr900r30a2rg1sqlshi4t.apps.googleusercontent.com",
  			type: "http://schema.org/CreateAction",
  			object: {
	  			name: "Corral",
	  			description: "Helping people get together at anytime with less hassle!"
  			}
  		});
  }

  $scope.initializeLaterSelection = function() {
    if (inputLaterDate==0&&inputLaterTime==0){
      var currentDate = new Date();
      var tDate=currentDate.toISOString().substr(0,10);
      var tTime=currentDate.toTimeString().substr(0,8);
      $scope.ilaterDate=tDate;
      $scope.ilaterTime=tTime;
      inputLaterDate=tDate;
      inputLaterTime=tTime;
    }
    else {
      $scope.ilaterDate=inputLaterDate;
      $scope.ilaterTime=inputLaterTime;
    }
    $scope.$broadcast('scroll.refreshComplete'); 
  }

  $scope.saveLaterSelection = function() {
    if (typeof jQuery('#laterDate').val()!='undefined'||typeof jQuery('#laterTime').val()!='undefined'){
      inputLaterDate=jQuery('#laterDate').val().toString();
      inputLaterTime=jQuery('#laterTime').val().toString();
    }
  }

  $scope.getInputDate = function() {
    return inputLaterDate;
  }

  $scope.getInputTime = function() {
    return inputLaterTime;
  }

  // These empty array initializations are to display
  // the empty list graphics in a browser
  $scope.nudgesList = [];
  $scope.requestsList = [];
  $scope.friendsList = [];
  $scope.friendsNow = [];
  $scope.friendsLater = [];

  $scope.initializeLaterSelection();
  $scope.refreshMyInfo();
  $scope.refreshFriendsNow();
  $scope.refreshFriendsLater();
  $scope.refreshRequestsList();
  $scope.refreshNudgesList();
  $scope.refreshFriendsList();

})
