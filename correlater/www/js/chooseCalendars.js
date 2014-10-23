$(function() {
	getCalendars();
});

function toast(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><p>"+msg+"</p></div>")
	.css({ display: "block",
		"background-color": "#000000",
		"color": "white",
		opacity: 0.90,
		position: "fixed",
		padding: "7px",
		"text-align": "center",
		width: "270px",
		left: ($(window).width() - 284)/2,
		top: $(window).height()/4 })
	.appendTo( $.mobile.pageContainer ).delay( 4500 )
	.fadeOut( 400, function(){
		$(this).remove();
	});
}

var cal;
function getCalendars() {
	jQuery.ajax({
		url: "http://e-wit.co.uk/correlater/google/getCalendars",
		dataType: "json",
		success: function (data){
			cal = data;

			$.each(data.calendars, function (i, calendar) {
				$('#chooseCalUl').append('<li><label><input type="checkbox" name="'+calendar.id+'">'+calendar.name+'</label></li>');
			});
			$('#chooseCalUl').listview("refresh");
			$('#chooseCal').submit(function(event) {
				event.preventDefault();
				var $this = $( this ),
	        theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
	        msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
	        textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
	        textonly = !!$this.jqmData( "textonly" );
	        html = $this.jqmData( "html" ) || "";
				$.mobile.loading( "show", {
          text: msgText,
          textVisible: textVisible,
          theme: theme,
          textonly: textonly,
          html: html
    		});
				var selectedCal = [];
				$('input:checked').each(function(){
					selectedCal.push($(this).attr('name'));
				});

				jQuery.ajax({
					type: "POST",
					url: 'http://e-wit.co.uk/gyngai/google/confirmCalendars',
					data: {id: selectedCal},
					dataType: 'json',
					complete: function (data) {
						if (data.responseText == "{\"message\":\"Calendar confirmation succeed\"}") {
							console.log("confirm calendar success");

							jQuery.ajax({
								url: 'http://e-wit.co.uk/gyngai/google/pullEvents',
								dataType:'json',
								complete: function (data){
									if(data.responseText == "{\"message\":\"Pull events succeed\"}") {
										console.log("Pull events succeed");
										$.mobile.loading( "hide" );
										toast("Pull events complete");
										window.location='main.html';
									} else {
										console.log("Pull events fail");
										$('#feedBack').text("Uh-oh something wrong. We'll try again later.");
									}
								}
							});

						} else {
							console.log("confirm calendar succeed");
						}
					}
				});
			});
		}
	});
}




