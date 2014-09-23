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
            console.log(code);
            $.post('https://accounts.google.com/o/oauth2/token', {
              code: code[1],
              client_id: options.client_id,
              client_secret: options.client_secret,
              redirect_uri: options.redirect_uri,
              grant_type: 'authorization_code'
            }).done(function(data) {
              data.code = code[1];
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

$(document).on('deviceready', function() {
  var loginButton = $('#login a');
  var loginStatus = $('#login p');

  $('#login a').on('click',function() {
    //alert("Success");
    googleapi.authorize({
      client_id: '514788609244-129u3h2nrdqrr900r30a2rg1sqlshi4t.apps.googleusercontent.com',
      redirect_uri: 'http://localhost',
      scope: 'profile email'
    }).done(function(data) {
      $.ajax({
          type: "POST",
          //url - function in php (add route)
          url: 'http://e-wit.co.uk/correlater/google/createWithGoogleAccount',
          //$_POST, try pr on _$post
          data: { google_access_token : data.access_token,
                  google_refresh_token : data.refresh_token,
                  google_id_token : data.id_token,
                  google_code : data.code
          }
      });
      loginStatus.html('Access Token: ' + data.access_token);
      window.open("calendar.html");
      console.log(data);
    }).fail(function(data) {
      loginStatus.html(data.error);
    });
  });


  $('#calendar a').on('click',function() {
    //alert("Success");
    googleapi.authorize({
      client_id: '514788609244-129u3h2nrdqrr900r30a2rg1sqlshi4t.apps.googleusercontent.com',
      redirect_uri: 'http://localhost',
      scope: 'https://www.googleapis.com/auth/calendar'
    }).done(function(data) {
      $.ajax({
          type: "POST",
          //url - function in php (add route)
          url: 'http://e-wit.co.uk/correlater/google/pullCalendar',
          //$_POST, try pr on _$post
          data: { google_access_token : data.access_token,
                  google_refresh_token : data.refresh_token,
                  google_id_token : data.id_token,
                  google_code : data.code
          }
      });
      loginStatus.html('Access Token: ' + data.access_token);
      console.log(data);
    }).fail(function(data) {
      loginStatus.html(data.error);
    });
  });


});



// $(document).on('deviceready', function() {
//   var 
// });

// GET https://www.googleapis.com/calendar/v3/users/me/calendarList?key={YOUR_API_KEY}


// https://accounts.google.com/o/oauth2/auth?
//   redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&
//   response_type=code&client_id=407408718192.apps.googleusercontent.com&
//   scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&approval_prompt=force&
//   access_type=offline


