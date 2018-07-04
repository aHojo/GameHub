// Initialize Firebase
var config = {
    apiKey: "AIzaSyDCniWnVuRsic78Wm9VRjHn3Ii4XvkOI-w",
    authDomain: "gamehub-contact.firebaseapp.com",
    databaseURL: "https://gamehub-contact.firebaseio.com",
    projectId: "gamehub-contact",
    storageBucket: "",
    messagingSenderId: "90775116298"
  };

firebase.initializeApp(config);

var database = firebase.database();

$("#contactSubmit").on("click", function(event) {
    var name = $("#nameInput").val().trim();
    var email = $("#emailInput").val().trim();
    var message = $("#messageInput").val().trim();

    if (name === "") {
        var message = $("<div>");
        message.addClass("alert");
        message.addClass("alert-danger");
        message.html("Please add a name!");

        $("#messageHolder").append(message);

        return;
    }

    if (email === "") {
        var message = $("<div>");
        message.addClass("alert");
        message.addClass("alert-danger");
        message.html("Please add an email!");

        $("#messageHolder").append(message);

        return;
    }

    if (message === "") {
        var message = $("<div>");
        message.addClass("alert");
        message.addClass("alert-danger");
        message.html("Please add a message!");

        $("#messageHolder").append(message);

        return;
    }


    var newContact = {
        name: name,
        email: email,
        message: message,
    };

    database.ref().push(newContact);

    $("#messageHolder").html("");

    $("#nameInput").val("");
    $("#emailInput").val("");
    $("#messageInput").val("");

    var message = $("<div>");
    message.addClass("alert");
    message.addClass("alert-primary");
    message.html("Thank you for your message!");

    $("#messageHolder").append(message);
});