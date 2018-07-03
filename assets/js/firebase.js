
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
          $("#search-button").on("click", function(e){
        event.preventDefault();
    
        var search = "";
    
    
    search = $("#search").val();
    
    $("#search-display").text(search);
    
    
    dataRef.ref().push({
    search:search,
    
    });
    
    });
    dataRef.ref().on("child_added", function (childSnapshot){
    
      var searchLast = childSnapshot.val().search;
    
             $("#pre-Search").append(
         "<span>"+ "<a href='" + "data-name=" + '"'+ value + '"' + "'>'" + searchLast  +"</a>"+ "</span>" + ",&nbsp;");
         
         });