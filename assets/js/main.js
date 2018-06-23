console.log("main.js loaded");

// Initialize Firebase
try {
    var config = firebaseConfig;
    firebase.initializeApp(config);
    db = firebase.database();
    console.log('Successfully initialized database');
} catch {
    console.log('Failed to initialize database');
}

// Delete this out - just for reference
var title = $('#title');
var wink = $('#wink');
title.css('text-align', 'center');
wink.css('height', '30px');

// Go nuts
