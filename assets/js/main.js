var ofAge = false;
var content = [];
var matches = [];

//API VARIABLES
const STEAM = "https://store.steampowered.com/api/appdetails/?appids=";
var appID;
var appIDForLink;

$(document).ready(function() {
        $('#ofAgeModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#ofAgeModal').modal('show');

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
                $('#ofAgeModal').modal('hide')
            }
        });
})



//Display for the steam games.
for (let i = 0; i < steamApps.applist.apps.length; i++){
    var deleteObj = /\b(beta|trailer|movie|demo|teaser|server|DLC|map\spack|pack|multiplayer\sskins|weapons\spack|weapons\sskins|starter\spack|premium\spack|pre.*order|sdk|player\sprofiles|Workshop|creation\sclub|texture\spack)\b/gi;
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
    for (let i = 0; i < content.length; i++) {
        if(content[i].name.match(search)) {
            matches.push(content[i]);
        }
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
                    searches.html(`${steamLink.name} <br /> ${steamLink.short_description}`);
                    searches.addClass('games');
                    searches.attr('data-appid', matches[i].appid);
                    searches.attr('data-name', matches[i].name);
                    searches.text(matches[i].name);
                    searches.addClass('games');
                    searches.attr('data-appid', matches[i].appid);
                    searches.attr('data-name', matches[i].name);
                    $("#search-content").append(searches);
                }
            }
        })
    }



};

var displaySearchContent = function() {
    $('#search-modal').modal({
        keyboard: false,
        backdrop: 'static'
    });
    $('#search-modal').modal('show');
    gameName();

};

$("#search-button").on("click", displaySearchContent)

//making the api call to steam
const getAppInfo = function(response) {
    var steamInfo = response[appID].data;
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
    console.log(steamInfo);
    console.log(steamName);
    console.log(steamPrice);
    console.log(steamAge);
    console.log(steamWeb);

    if(steamInfo.hasOwnProperty('metacritic.score')){
        var steamScore = steamInfo.metacritic.score;
    } else {
        var steamScore = "No Score Available"
    }

    if(steamInfo.hasOwnProperty('movies')) {
        var steamMovie = steamInfo.movies[0].webm.max;
    }

    $("#gametitle").text(steamName);
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


    // $('#gameDiv').append(
    //     $('<div>').text(steamInfo.name),
    //     $('<div>').text(steamInfo.metacritic.score),
    //     $('<div>').text(steamInfo.required_age),
    //     $('<div>').text(steamAbout),
    //     $('<img>').attr('src', steamInfo.header_image),
    //     $('div').attr('src', steamScreenshot)

    // )
    $('#search-modal').modal('hide');
}


//clicking on a search item
$("#search-modal").on("click", '.games', function() {

    appID = $(this).attr('data-appid');

    $.ajax({
        url: STEAM + appID,
        method: "GET",
    }).then(getAppInfo).fail(function(error) {
        console.log(error);
        var index = content.indexOf(appID);
        console.log("index: " + index);
    });
});