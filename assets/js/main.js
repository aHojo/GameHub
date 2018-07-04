var ofAge = false;
var content = [];
var matches = [];
var steamPrevious;

//API VARIABLES
const STEAM = "https://store.steampowered.com/api/appdetails/?appids=";
var appID;
var appIDForLink;

$(document).ready(function() {
    if(!JSON.parse(localStorage.getItem('ofAge'))){
        $('#ofAgeModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#ofAgeModal').modal('show');

            $('#ofAgeCheck').on("click", function(){
                if (this.checked) {
                    localStorage.setItem("ofAge", true);
                    // ofAge = true;
                    console.log("Checked");
                } else {
                    // ofAge = false;
                    localStorage.setItem("ofAge", false);
                    console.log("Unchecked");
                }
            });


            $('#ofAgeBtn').on("click", function() {
                if(JSON.parse(localStorage.getItem('ofAge'))){
                    $('#ofAgeModal').modal('hide')
                }
            });
    }
})



//Display for the steam games.
for (let i = 0; i < steamApps.applist.apps.length; i++){
    var deleteObj = /\b(beta|trailer|movie|demo|teaser|server|DLC|map\spack|pack|multiplayer\sskins|weapons\spack|weapons\sskins|starter\spack|premium\spack|pre.*order|sdk|player\sprofiles|Workshop|creation\sclub|texture\spack|game\ssoundtrack)\b/gi;
    var deleteObj2 = /\bRU\b/g;
    if (deleteObj.test(steamApps.applist.apps[i].name) || deleteObj2.test(steamApps.applist.apps[i].name)) {
        delete steamApps.applist.apps[i];
    } else {
        content.push({
            "appid": steamApps.applist.apps[i].appid,
            "name":steamApps.applist.apps[i].name.replace(/[-:]/g,' ')
        })
    }
}

function gameName() {
    var game = $("#game-search").val().trim();
    var gameSearch = game.split(' ').join("\\s");
    console.log(gameSearch);
    var search = new RegExp(gameSearch, 'i');
    console.log(search);
    matches = [];
    $("#search-content").empty();
    $('#game-search').empty();
    for (let i = 0; i < content.length; i++) {
        if(content[i].name.match(search)) {
            matches.push(content[i]);
        }
    }
    if(matches.length === 0){
        $("#search-content").html(`<h2>I'm sorry, ${game} is not in our library.</h2>`)
    }
    for(let i = 0; i < matches.length; i ++){
        appIDForLink = matches[i].appid;
        $.ajax({
            url: STEAM + appIDForLink,
            method: "GET",
            success: function(response) {
                console.log(response);
                console.log('Name:' + matches[i].name + "\n" + "Appid: " + matches[i].appid);
                var steamLink = response[matches[i].appid].data;
                // console.log("SteamLink" + steamLink.name);
                if(steamLink){
                    var searches = $('<div>');
                    var anchor = $('<a>');
                    var p = $('<p>');
                    searches.addClass("card");
                    anchor.text(`${steamLink.name}`);
                    p.text(`${steamLink.short_description}`)
                    anchor.addClass("card-header game-link");
                    anchor.attr('data-appid', matches[i].appid);
                    anchor.attr('data-name', matches[i].name);
                    p.addClass("card-text");
                    // searches.html(`${steamLink.name} <br /> ${steamLink.short_description}`);
                    searches.append(anchor, p);
                    searches.addClass('games');
                    // searches.attr('data-appid', matches[i].appid);
                    // searches.attr('data-name', matches[i].name);
                    $("#search-content").append(searches);
                }
            }
        })
    }



};

var displaySearchContent = function() {
    $('#search-modal').modal('show');
    gameName();

};

$("#search-button").on("click", displaySearchContent)

//making the api call to steam
const getAppInfo = function(response) {
    var steamInfo = response[appID].data;
    var steamAppId = appID;
    var steamName = steamInfo.name;
    var steamLogo = steamInfo.header_image;
    var steamAge = steamInfo.required_age;

    var steamScreenshot = steamInfo.screenshots[0].path_full;
    var steamScreenshot1 = steamInfo.screenshots[1].path_full;
    var steamScreenshot2 = steamInfo.screenshots[2].path_full;
    var steamAbout = steamInfo.short_description;
    var steamPrice = steamInfo.price_overview.final + steamInfo.price_overview.currency;
    var steamWeb = steamInfo.website;
    var steamReqs = steamInfo.pc_requirements.minimum;
    console.log("Steam App Id" + steamAppId);

    if(steamInfo.hasOwnProperty('metacritic')){
        var steamScore = steamInfo.metacritic.score;
    } else {
        var steamScore = "No Score Available"
    }

    if(steamInfo.hasOwnProperty('movies')) {
        var steamMovie = steamInfo.movies[0].webm.max;
    }

    $("#gametitle").attr({"data-name": steamName, "data-appid": steamAppId}).text(steamName);
    $("#metacritic").text(`Metacritic Score: ${steamScore}`);
    $("#age").text(`Required Age: ${steamAge}`);
    $('#headerimg').attr('src', steamLogo);
    $('#video').attr('src', steamMovie);
    $('#gameimage1').attr('src', steamScreenshot);
    $('#gameimage2').attr('src', steamScreenshot1);
    $('#gamedescription').html(`${steamAbout}`);
    $('#gameurl').text(`Dev Website: ${steamWeb}`);
    $('#gameprice').text(`Price: ${steamPrice}`);
    $('#requirements').html(`System Requirements: ${steamReqs}`);
    $('#search-modal').modal('hide');


    if (steamScore >= 75) {
        document.getElementById("metacritic").style.backgroundColor = 'green';
        }
    else if (steamScore <= 60) {
       document.getElementById("metacritic").style.backgroundColor = 'yellow';
       }
    else if (steamScore <= 50) {
       document.getElementById("metacritic").style.backgroundColor = 'red';
       }
    else {
    document.getElementById("metacritic").style.backgroundColor = '#fff';
    }

    $("#main-container").show();
}


//clicking on a search item
$("#search-modal").on("click", '.game-link', function() {

    appID = $(this).attr('data-appid');
   steamPrevious = $(this).attr('data-name');
   dataRef.ref().push({
       name: steamPrevious,
       appid: appID
   })
    $.ajax({
        url: STEAM + appID,
        method: "GET",
    }).then(getAppInfo).fail(function(error) {
        console.log(error);
        var index = content.indexOf(appID);
        console.log("index: " + index);
    });
});

//close the search modal
$('#close-btn').on("click", function() {
    $('#search-modal').modal('hide');
})

//wishilist/recentsearch click
$(document).on('click', '.wishlist', function() {
    console.log("clicked on wishlist " + $(this).attr('data-appid'));

    appID = $(this).attr('data-appid');

    // var wishID = $(this).attr('data-appid');
    $.ajax({
        url: STEAM + appID,
        method: "GET",
    }).then(getAppInfo);
})