var ofAge = false;
var gameName;
var filterLimit = 3;

$(document).ready(function() {
    $('.modal').modal('show');
    $('#changebtn').on("click", function() {
        ofAge = true;
        console.log("Changed the Variables");
    })

})

