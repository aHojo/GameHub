
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyCxloZvfl8MuRCcH3T9cVaIZl0lA1x1mmw",
        authDomain: "gamehub-ee1b3.firebaseapp.com",
        databaseURL: "https://gamehub-ee1b3.firebaseio.com",
        projectId: "gamehub-ee1b3",
        storageBucket: "gamehub-ee1b3.appspot.com",
        messagingSenderId: "778532278767"
          };
          firebase.initializeApp(config);
          var dataRef = firebase.database();

    dataRef.ref().on("child_added", function (childSnapshot){


      var gameID = childSnapshot.val().name;
      var searchedID = childSnapshot.val().appid;
      console.log("SearchID " + gameID);
              var a = $('<a>');
              a.attr({
                "href": "#",
                "class": 'wishlist',
                "data-name": gameID,
                "data-appid": searchedID
              });
              a.text(gameID);
              
             $("#pre-Search").append(a);
      });
        //  <span> <a href="#" class='wishlist' data-name=${steamPrevious} data-appid=${searchedID}> ${gameID} </a></span>`);