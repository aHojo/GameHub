//     //YouTube Api request. "q" is the word search paramenter
var youtubeCall = function() {
    var randNum = Math.floor(Math.random() * 5) + 1;
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: "snippet, id",
            q: steamPrevious,
            type: "video",
            maxResults: "10",
            key: "AIzaSyCwdYAWeOqZuqkqKwb1d0ZCzUrIDNZYDSw"},
            function(data){
                console.log(data);
                var youtubeRef = data.items[randNum];
                
                videoId = youtubeRef.id.videoId
                console.log("Vid ID:" + videoId);
                var vid = "https://www.youtube.com/embed/" + videoId + "?rel=0";
                $('#video').attr('src', vid);
    
            }
    );
}

// dim background
$(document).ready(function(){
    $("#shadow").css("height", $(document).height()).hide();
    $(".lightSwitcher").click(function(){
        $("#shadow").toggle();
        if ($("#shadow").is(":hidden"))
            $(this).html("Turn off the lights").removeClass("turnedOff");
         else
            $(this).html("Turn on the lights").addClass("turnedOff");
    });
});