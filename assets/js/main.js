//GLOBAL VARIABLES
var ofAge = false;
var content = [];
var matches = [];
var steamPrevious;
var videoId;

//API VARIABLES
const STEAM = "https://store.steampowered.com/api/appdetails/?appids=";
var appID;
var appIDForLink;
/*
 * This is to keep track of how many times we have loaded the page, 
 * and after 5 refreshes will ask again
 */
var visits = parseInt(localStorage.getItem("visited"), 10);;
visits_count = visits ? visits + 1 : 1;
localStorage.setItem("visited", visits_count);
//This is where we check how many times we have visited. 
$(document).ready(function () {
    console.log(localStorage.getItem("visited"));
    if (parseInt(localStorage.getItem("visited"), 10) >= 5) {
        localStorage.setItem('ofAge', false);
    }

    //If of age is false then display our modal, and wait until they confirm they are of age. 
    if (!JSON.parse(localStorage.getItem('ofAge'))) {
        $('#ofAgeModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#ofAgeModal').modal('show');
        //set's the visits. 
        localStorage.setItem('visited', visits);

        //Use the check box to change of age. 
        $('#ofAgeCheck').on("click", function () {
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

        //If the box is checked, when clicking the button, then reset visited, and hide modal. 
        $('#ofAgeBtn').on("click", function () {
            if (JSON.parse(localStorage.getItem('ofAge'))) {
                localStorage.setItem("visited", 0);
                console.log(localStorage.getItem("visited"));
                $('#ofAgeModal').modal('hide');
            }
        });
    }

})



//Display for the steam games.
for (let i = 0; i < steamApps.applist.apps.length; i++) {
    //list of items to get rid of in our steam object. 
    var deleteObj = /\b(beta|trailer|movie|demo|teaser|server|DLC|map\spack|pack|multiplayer\sskins|weapons\spack|weapons\sskins|starter\spack|premium\spack|pre.*order|sdk|player\sprofiles|Workshop|creation\sclub|texture\spack|game\ssoundtrack)\b/gi;
    var deleteObj2 = /\bRU\b/g;

    //delete if there is a match, or push the object to an array
    if (deleteObj.test(steamApps.applist.apps[i].name) || deleteObj2.test(steamApps.applist.apps[i].name)) {
        delete steamApps.applist.apps[i];
    } else {
        content.push({
            "appid": steamApps.applist.apps[i].appid,
            "name": steamApps.applist.apps[i].name.replace(/[-:]/g, ' ')
        })
    }
}

/*
 * gameName() takes the term that we have searched for  searches in our content array
 * to get matches, if there is a match, push it to the matches array.
 */
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
        if (content[i].name.match(search)) {
            matches.push(content[i]);
        }
    }

    //If there are not matches display something. 
    if (matches.length === 0) {
        $("#search-content").html(`<h2>I'm sorry, ${game} is not in our library.</h2>`)
    }
    for (let i = 0; i < matches.length; i++) {
        appIDForLink = matches[i].appid;
        $.ajax({
            url: STEAM + appIDForLink,
            method: "GET",
            success: function (response) {
                console.log(response);
                console.log('Name:' + matches[i].name + "\n" + "Appid: " + matches[i].appid);
                var steamLink = response[matches[i].appid].data;

                //format for our search results.
                if (steamLink) {
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
                    searches.append(anchor, p);
                    searches.addClass('games');
                    $("#search-content").append(searches);
                }
            }
        })
    }



};

//Displays the search modal
var displaySearchContent = function () {
    $('#search-modal').modal('show');
    gameName();

};
//Search Button Click Enter to Search
$('#game-search').keypress(function(e){
    if(e.which == 13) {
        displaySearchContent();
    }
});

$("#search-button").on("click", displaySearchContent)

//making the api call to steam
const getAppInfo = function (response) {
    var steamInfo = response[appID].data;
    var steamAppId = appID;
    var steamName = steamInfo.name;
    var steamLogo = steamInfo.header_image;
    var steamAge = steamInfo.required_age;
    var steamAbout = steamInfo.short_description;
    var steamReqs = steamInfo.pc_requirements.minimum;

    //check if the game is free, otherwise print price.
    if (!steamInfo.is_free) {
        var steamPrice = steamInfo.price_overview.final + ' ' + steamInfo.price_overview.currency;
    } else {
        var steamPrice = "FREE!"
    }

    //The dev website
    if (steamInfo.website === null) {
        var steamWeb = "www.store.steampowered.com";
    } else {
        console.log("HELLO THIS IS DAWG");
        var steamWeb = steamInfo.website;
    }

    //If steam has a metacritic score
    if (steamInfo.hasOwnProperty('metacritic')) {
        var steamScore = steamInfo.metacritic.score;
    } else {
        var steamScore = "No Score Available"
    }

    //stops code from breaking if there is no screenshots. 
    if (steamInfo.screenshots[0]) {
        var steamScreenshot = steamInfo.screenshots[0].path_full;
    } else {
        $('#gameimage1').attr("src", "");
    }
    if (steamInfo.screenshots[1]) {
        var steamScreenshot1 = steamInfo.screenshots[1].path_full;
    } else {
        $('#gameimage2').attr("src", "http://www.blogforweb.com/wp-content/uploads/2016/05/social-media-gaming-e1463079825431-790x381.jpg");
    }

    if (steamInfo.screenshots[2]) {
        var steamScreenshot1 = steamInfo.screenshots[2].path_full;
    }


    $("#gametitle").attr({
        "data-name": steamName,
        "data-appid": steamAppId
    }).text(steamName);
    $("#metacritic").text(`Metacritic Score: ${steamScore}`);
    $("#age").text(`Required Age: ${steamAge}`);
    $('#headerimg').attr('src', steamLogo);
    $('#gameimage1').attr('src', steamScreenshot);
    $('#gameimage2').attr('src', steamScreenshot1);
    $('#gamedescription').html(`${steamAbout}`);
    $('#game-link').attr('href', steamWeb);
    $('#game-link').text(`${steamWeb}`);
    $('#gameprice').text(`Price: ${steamPrice}`);
    $('#requirements').html(`${steamReqs}`);
    $('#search-modal').modal('hide');

    //For Wishlist
    var wishlist = JSON.parse(localStorage.getItem('wishlist'));
    var onWishlist = false;

    if (wishlist != null) {
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i] == steamName) {
                onWishlist = true;
            }
        }
    }

    $('#wishlist-already-on-list').empty();
    $('#wishlist-button-holder').hide();

    if (onWishlist == true) {
        $('#wishlist-already-on-list').append('<p class="onwishlist">This game is on your wishlist</p>');
    } else {
        $('#wishlist-button').attr('gametitle', steamName);
        $('#wishlist-button-holder').show();
    }

    //displays a little green square next to the metacritic score
    if (steamScore >= 75) {
        document.getElementById("metacritic-icon").style.backgroundColor = 'green';
    } else if (steamScore >= 60 && steamScore < 75) {
        document.getElementById("metacritic-icon").style.backgroundColor = 'yellow';
    } else if (steamScore <= 50 && steamScore < 60) {
        document.getElementById("metacritic-icon").style.backgroundColor = 'red';
    } else {
        document.getElementById("metacritic-icon").style.backgroundColor = '#FFF';
    }

    $("#main-container").show();
}


//clicking on a search item
$("#search-modal").on("click", '.game-link', function () {

    // this is the ajax call to display all of our items on the page. 
    appID = $(this).attr('data-appid');
    steamPrevious = $(this).attr('data-name');
    console.log("steam " + steamPrevious);
    dataRef.ref().push({
        name: steamPrevious,
        appid: appID
    })
    $.ajax({
        url: STEAM + appID,
        method: "GET",
    }).then(getAppInfo).fail(function (error) {
        console.log(error);
        $('#search-modal').modal('hide');
    });
    //gets the youtube video. 
    youtubeCall();
});

//close the search modal
$('#close-btn').on("click", function () {
    $('#search-modal').modal('hide');
})

//wishilist/recentsearch click
$(document).on('click', '.wishlist', function () {
    console.log("clicked on wishlist " + $(this).attr('data-appid'));
    steamPrevious = $(this).attr('data-name');
    appID = $(this).attr('data-appid');

    // var wishID = $(this).attr('data-appid');
    $.ajax({
        url: STEAM + appID,
        method: "GET",
    }).then(getAppInfo);
    youtubeCall();
})