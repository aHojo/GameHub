var ofAge = false;
var gameName;
var filterLimit = 3;

$(document).ready(function() {
        $('.modal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('.modal').modal('show');

        $('#ofAgeCheck').on("click", function(){
            if (this.checked) {
                ofAge = true;
                console.log("Checked");
            } else {
                ofAge = false;
                console.log("Unchecked");
            }
        });


        $('#ofAgeBtn').on("click", function() {
            if(ofAge){
                $('.modal').modal('hide')
            }
        });
})

