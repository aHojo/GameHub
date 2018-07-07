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
