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
    }
    
})