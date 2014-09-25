$( document ).on( "pagecreate", "#main", function() {
    $( document ).on( "swipeleft swiperight", "#main", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" ) {
                $( "#rightPanel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#leftPanel" ).panel( "open" );
            }
        }
    });
});