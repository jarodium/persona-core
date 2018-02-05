"use strict";
/* aditional trapping of the notifications in order to filter them */
socket.on("notification", function(m){ 
    if (m.notification =='eid_service') {
        if (m.message == "CARD_INSERTED") {
            $("#status").text("Card in");
        }
        if (m.message == "CARD_REMOVED") {
            $("#status").text("Card out");
        }    
        if (m.message == "CARD_NOT_EXISTS") {

        }
    }
    
})



$(function() {
    //PINPAD EVENTS
    $("body").on("click",".PINbutton",function() {
        if ($(this).hasClass("clear")) {
            $('#PINbox').val("");
        }
        else if ($(this).hasClass("enter")) {
            //card registration goes here
            if ($.trim($("#PINbox").val() == '')) {
                alert("Please enter the 4 digit PIN required!");
            }
            else {
                var pin = $("#PINbox").val();
                if ($("#PINform").data("mode") == "ID") {
                    $("#PINform").data("PINID",pin);
                    $("#PINform").data("mode","ADDR");
                }
                if ($("#PINform").data("mode") == "ADDR") {
                    $("#PINform").data("PINADR",pin);
                    $("#PINform").data("mode","ID");
                    //submit to service
                }
            }
            
        }
        else {
            $('#PINbox').val($("#PINbox").val()+$(this).val());
        }
    })

    $.get("eid/index.html", function(data){
        $("body").append(data);

        
        /*function addNumber(e){
            //
            var v = $( "#PINbox" ).val();
            $( "#PINbox" ).val( v + e.value );
        }
        function clearForm(e){
            //document.getElementById('PINbox').value = "";
            $( "#PINbox" ).val( "" );
        }
        function submitForm(e) {
            if (e.value == "") {
                alert("Enter a PIN");
            } else {
                alert( "Your PIN has been sent! -  e.value );
                data = {
                    pin: e.value
                }
                /*		
                apiCall( data, function( r ) {
                    $( "#logo" ).attr( "src", r.site_logo );
                    $( ".title-msg" ).text( r.site_msg );
                    accent = r.accent;
                    $( ".accent-bg" ).css( "background-color", accent );
                });
                */
                
                //document.getElementById('PINbox').value = "";
                /*$( "#PINbox" ).val( "" );
            };
        };*/
        
        /*
        function apiCall( post, callback ) {	
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "admin/api.php",
                data: JSON.stringify( post ),
                dataType: "json",
                success: function ( r ) {
                    callback( r );
                },
                error: function ( response ) {
                    console.log( response )
                },
            });
        }
        */
    });
});