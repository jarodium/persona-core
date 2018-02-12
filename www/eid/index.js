"use strict";

var EID_SERVICE = "http://192.168.56.101:3001";
/* aditional trapping of the notifications in order to filter them */
socket.on("notification", function(m){ 
    if (m.notification =='eid_service') {
        if (m.message == "CARD_INSERTED") {
            $("#status").text("Card in");
            $.get(EID_SERVICE+"/exists",function(data) {
                console.log("exists done");
            });

            $("#cardOn").removeClass("hidden");
        }
        if (m.message == "CARD_REMOVED") {
            $("#status").text("Card out");
            $("#cardOn").addClass("hidden");
        }    
        if (m.message == "CARD_NOT_EXISTS") {
            $("#PINcode,#PINcode h4").removeClass("hidden");            
        }
        if (m.message == "CARD_EXISTS") {
            console.log("card existe");
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
            if ($.trim($("#PINbox").val()) == '') {
                alert("Please enter the 4 digit PIN required!");
            }
            else {
                var pin = $("#PINbox").val();
                if ($("#PINform").data("mode") == "ID") {
                    $("#PINform").data("PINID",pin);
                    $("#PINform").data("mode","ADDR");
                    
                    $("#PINcode h5").toggleClass("hidden");
                    $('#PINbox').val("");
                }
                else if ($("#PINform").data("mode") == "ADDR") {
                    $("#PINform").data("PINADR",pin);
                    $("#PINform").data("mode","ID");
                    $("#PINcode h5").toggleClass("hidden");
                    //submit to service
                    $.post(EID_SERVICE+"/register/"+ $("#PINform").data("PINID")+"/"+ $("#PINform").data("PINADR"),function(data) {                        
                        console.log(data);
                    });
                }
            }
            
        }
        else {
            $('#PINbox').val($("#PINbox").val()+$(this).val());
        }
    })

    $.get("eid/index.html", function(data){
        $("body").append(data);
        $.get(EID_SERVICE+"/exists",function(data) {
            console.log("exists done");
        });
    });
});