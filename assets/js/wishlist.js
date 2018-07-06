$("#wishlist-button").click(function () {
    var wishlist = JSON.parse(localStorage.getItem('wishlist'));

    var gameToAdd = $("#wishlist-button").attr("gametitle");

    // wishlist is empty
    if (wishlist == null) {
        var newWishlist = [];
        newWishlist.push(gameToAdd);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    } else {
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i] == gameToAdd) {
                return;
            }
        }

        wishlist.push(gameToAdd);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    $('#wishlist-already-on-list').empty();
    $('#wishlist-button-holder').hide();

    $('#wishlist-already-on-list').append('<p class="onwishlist">This game is on your wishlist</p>');
});

$(document).ready(function () {
    setUpWishlist();
});

function setUpWishlist() {
    $("#wishlist-games").empty();

    var wishlist = JSON.parse(localStorage.getItem('wishlist'));

    if (wishlist == null) {
        return;
    }

    for (var i = 0; i < wishlist.length; i++) {
        $("#wishlist-games").append('<input type="checkbox" class="wishlist-checkbox" game="' + wishlist[i] + '">');
        $("#wishlist-games").append('<span for="wishgame" class="wishlistgamename">' + wishlist[i] + '</span>');
        $("#wishlist-games").append('<br>');
    }
}

$("#deletewish").click(function () {
    var gamesToDelete = [];
    $('#wishlist-games input:checked').each(function () {
        gamesToDelete.push($(this).attr('game'));
    });

    var wishlist = JSON.parse(localStorage.getItem('wishlist'));

    for (var i = 0; i < gamesToDelete.length; i++) {
        if (wishlist.indexOf(gamesToDelete[i]) !== -1) {
            wishlist.splice(wishlist.indexOf(gamesToDelete[i]), 1);
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    setUpWishlist();
});