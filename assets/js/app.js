var config = {
    apiKey: "AIzaSyCi10JcjjSel5XlM6I8I3MnYSvnQhVhWu8",
    authDomain: "rockpaperscissors-jt.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-jt.firebaseio.com",
    projectId: "rockpaperscissors-jt",
    storageBucket: "rockpaperscissors-jt.appspot.com",
    messagingSenderId: "202864983035",
    appId: "1:202864983035:web:e45428a21ff94efe"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var choice = "";
var winlose = "";

// $("#player1").on("click", function(event) {
//     // Prevent the page from refreshing
//     player1

$("#paper").on("click", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();
    player1Choice = "paper"
    alert(player1Choice);

    database.ref().set({
        player1Choice: player1Choice
    });
});

$("#rock").on("click", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();
    player1Choice = "rock"
    alert(player1Choice);

    database.ref().set({
        player1Choice: player1Choice
    });
});

database.ref().on("value", function (fireInfo) {
    var ducks = fireInfo.val().player1Choice;

    if (ducks === "rock") {
        $("#user").text("R0cK");
    } else if (ducks === "paper") {
        $("#user").text("P@per");
    }
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
//----Sets up pathways for users and chat----
var lobbyRef = database.ref("/lobby")
var chatRef = database.ref("/chat")
var userChat
var queueRef = database.ref("/queue")
var queueNum
var gameRef = database.ref("/gameroom");
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
//--------------
var username = "";
var ready ="";
var lobbyRef = lobbyRef.push({
    username: username,
    ready: ready,
});

connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        userChat = chatRef.push({
            chat: "",
        });
        con.onDisconnect().remove();
        lobbyRef.onDisconnect().remove();
        userChat.onDisconnect().remove();
    };
    connectionsRef.on("value", function (snap) {
        $("#watchers").text(snap.numChildren())
        if (snap.numChildren() === 2) {
            
        }
    });
});
//When user  clicks 'Ready' button the user database is updated to true
//Firebase organizes the users by the ones that are ready and makes a copy of the 1st two ready users and puts them in the /game path.
//--- Submit Chat Button---
$("#ready").on("click", function (event) {
    event.preventDefault();
    lobbyRef.remove();
    var userInQueue = queueRef.push({
        username: username,
        ready: ready,
    });
    gameRef.on("value", function(snapshot){
        gameNum = snapshot.numChildren();
        console.log("Number of Game Rooms: " + gameNum)
    });
    queueRef.on("value", function (snapshot){
        queueNum = snapshot.numChildren();
        if (queueNum >= 2) {
            userInQueue.remove();
            var createRoom = gameRef.child("Room" + gameNum);
            createRoom.push({
                    choice: choice,
                    winlose: winlose,
                });
                queueRef.off("value");
            numRoom = gameRef.numChildren;
            createRoom.onDisconnect().remove();  
            userInQueue.onDisconnect().remove();
            createRoom.on("child_added", function (snap){
                numRoom = snap.numChildren;
                console.log("There are " + numRoom + "rooms.")
            });
            
            gameRef.on("value", function (snapshot){
                
            })
                console.log("---" + queueNum + "---")
        }
    });
    
     
});

//--- Submit Chat Button---
$("#submit").on("click", function (event) {
    event.preventDefault();
    
    var userInput = $("#chat").val();
    userChat.child("chat").set(userInput);
    $("#chat").val("")
});

chatRef.on("child_changed", function (snapshot) {
    var chatDiv = $("<h4>");
    var newMessage = snapshot.child("chat").val();
    console.log(snapshot.child("chat").val());
    $(chatDiv).html(":" + newMessage);
    $("#chatBox").append(chatDiv);
    

}, function (errorObject) {
console.log("Errors handled: " + errorObject.code);
});

database.ref("/lobby").on("value", function (snapshot){
    console.log(snapshot.val());
    // queue.child(database.ref("/lobby/user/ready"));
})//--- Firebase watcher, listens and executes function when a child element is changed in the chat pathway---

//

// connectedRef.on("value", function(snap) {

//     if (snap.val()) {

//     var con = connectionsRef.push(true);
//     var cli = database.ref("/clicks").push(100);
//     console.log(con)

//     cli.onDisconnect().remove();
//     con.onDisconnect().remove();
//   }
// });

// connectionsRef.on("value", function(snapshot) {
//   $("#viewers").text(snapshot.numChildren());
// });

// clicksRef.on("value", function(snapshot) {
//     $("#playerNumber").text(snapshot.numChildren());
// });

// var initialValue = 100;
// var clickCounter = initialValue;

// database.ref("/clicks").on("value", function(snapshot) {
//     console.log(snapshot.val());
//     clickCounter = snapshot.val().clickCount;
//     $("#clicks").text(clickCounter);
// });

// $(document).on("click", function() {
//     clickCounter--;
//     if (clickCounter === 0) {
//         alert("Phew! You made it! That sure was a lot of clicking.");
//         clickCounter = initialValue;
//     }
//     database.ref("/clicks").set({
//         clickCount: clickCounter
//     });
// });

//   var queryURL = "https://api.twitter.com/1.1/search/tweets.json?q=batman";
//   $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(response) {

//     $("#scissors").on("click", function() {
//       console.log(response);
//       });
//     });



