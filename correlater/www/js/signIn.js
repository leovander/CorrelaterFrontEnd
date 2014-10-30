var googleapi = {
    authorize: function(options) {
        var deferred = $.Deferred();

        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        $(authWindow).on('loadstart', function(e) {
          var url = e.originalEvent.url;
          var code = /\?code=(.+)$/.exec(url);
          var error = /\?error=(.+)$/.exec(url);

          if (code || error) {
            authWindow.close();
          }

          if (code) {
            $.post('https://accounts.google.com/o/oauth2/token', {
              code: code[1],
              client_id: options.client_id,
              client_secret: options.client_secret,
              redirect_uri: options.redirect_uri,
              grant_type: 'authorization_code'
            }).done(function(data) {
              data.code=code[1];
              deferred.resolve(data);
            }).fail(function(response) {
              deferred.reject(response.responseJSON);
            });
          } else if (error) {
            deferred.reject({
              error: error[1]
            });
          }
        });

        return deferred.promise();
    }
};

var response;

$(document).on('deviceready', function() {
  var $loginButton = $('#googleLogin');
  var $loginStatus = $('#feedBack');

  $("#nativeLogin").on('click', function(){
  	window.location='nativeSignIn.html';
  });

  $loginButton.on('click', function() {
    googleapi.authorize({
      client_id: '514788609244-129u3h2nrdqrr900r30a2rg1sqlshi4t.apps.googleusercontent.com',
      redirect_uri: 'http://localhost',
      scope: 'profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly'
      // scope: 'profile email'
      //https://www.googleapis.com/auth/plus.login
    }).done(function(data) {
      $.ajax({
          type: "POST",
          url: 'http://e-wit.co.uk/correlater/google/login',
          data: { google_access_token : data.access_token,
                  google_refresh_token : data.refresh_token,
                  google_id_token : data.id_token,
                  google_code : data.code },
          dataType: 'json'
      }).done(function(data) {
        if (data.message == 'Logged In'){
          $loginStatus.html(data.message);
          $loginStatus.css('color','green');
          window.location='main.html';
        } else {
          $loginStatus.html(data.message);
          $loginStatus.css('color','red');
        }
      });
    }).fail(function(data) {
      $loginStatus.html('Login Failed');
      $loginStatus.css('color','red');
    });
  });
});

// Facebook Login Code

$(function(){
	$('#Facebook').on('click', function() {
		openFB.init({appId: "1480365258889009"});
		openFB.login(checkLogin, {scope: 'email'});
    });
});	

function checkLogin() {
	var token = localStorage.getItem("fbtoken");
	$.ajax({
		url: 'https://graph.facebook.com/v2.1/me?access_token=' + token + '&fields=id%2Cfirst_name%2Clast_name%2Cemail&format=json',
		dataType: 'json'
	}).done(function(data) {
		var params = {	email: data.email,
						facebook_id: data.id,
						facebook_token: token	   	
					};
		$.ajax({
			type: 'POST',
			url: 'http://e-wit.co.uk/correlater/facebook/login',
			data: params,
			dataType: 'json'
		}).done(function(data) {
			if (data.message == 'Logged In'){
	          $('#feedBack').html(data.message);
	          $('#feedBack').css('color','green');
	          window.location = 'main.html';
	        } else {
	          $('#feedBack').html(data.message);
	          $('#feedBack').css('color','red');
	        }
		});
	});
}

function errorHandler(error) {
    alert(error.message);
}