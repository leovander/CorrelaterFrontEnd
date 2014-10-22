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
  var $nativeCreate = $('#nativeCreate');

  $nativeCreate.on('click', function(){
    // $.mobile.changePage( "nativeCreate.html", { transition: "flip", changeHash: true });
    window.location='nativeCreate.html';
  });

  $loginButton.on('click', function() {
    googleapi.authorize({
      client_id: '514788609244-129u3h2nrdqrr900r30a2rg1sqlshi4t.apps.googleusercontent.com',
      redirect_uri: 'http://localhost',
      scope: 'profile email https://www.googleapis.com/auth/calendar.readonly'
      // scope: 'profile email'
      //https://www.googleapis.com/auth/plus.login
    }).done(function(data) {
      $.ajax({
          type: "POST",
          url: 'http://e-wit.co.uk/correlater/google/create',
          data: { google_access_token : data.access_token,
                  google_refresh_token : data.refresh_token,
                  google_id_token : data.id_token,
                  google_code : data.code },
          dataType: 'json'
      }).done(function(data) {
        if (data.message == 'Account Created'){
          $loginStatus.html(data.message);
          $loginStatus.css('color','green');
          window.location='main.html';
        } else {
          $loginStatus.html(data.message);
          $loginStatus.css('color','red');
        }
      });
    }).fail(function(data) {
      $loginStatus.html('Login Failed :(');
      $loginStatus.css('color','red');
    });
  });
});

// Facebook Login Code

$(function(){
		$('#Facebook').on('click', function(){
      window.location = "http://www.facebook.com/dialog/oauth?client_id=1480365258889009&redirect_uri=https://www.facebook.com/connect/login_success.html&response_type=token";
    });
});	

