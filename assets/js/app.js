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
var gameNum = 0
var playerKey
var player1Choice = ""
var player2Choice = ""
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
//--------------
var username = "";
var ready ="";
var lobbyRef = lobbyRef.push({
    username: username,
    ready: ready,
});
var wins = 0;

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
    $(this).attr("disabled", true);
    event.preventDefault();
    lobbyRef.remove();
    var userInQueue = queueRef.push({
        username: username,
        ready: ready,
    });
    gameRef.on("child_added", function(snapshot){
        gameNum = snapshot.numChildren();
        console.log("Number of Game Rooms: " + gameNum)
    });
    queueRef.on("value", function (snapshot){
        queueNum = snapshot.numChildren();
        console.log("Users in Queue: " + queueNum)
        if (queueNum >= 2) {
            userInQueue.remove();
            var createRoom = gameRef.child("Room" + gameNum);
            var userRoom = createRoom.push({
                    choice: choice,
                    wins: wins,
            });
            createRoom.onDisconnect().remove();
            
            createRoom.on("child_added", function (snap){
                gameKey = snap.key;
                console.log("Your room is called " + gameKey + " .")
                if (userRoom.key != gameKey) {
                    playerKey = userRoom.key;
                    console.log("The other users room is: " + playerKey)
                }
            });

                queueRef.off("value");
                $("#gameplay").removeClass("d-none");
                $("#score").removeClass("d-none");
                $("#chatBox").removeClass("d-none");
                $("#gameplay").addClass("d-flex");
                $("#score").addClass("d-flex");
                $("#chatBox").addClass("d-flex flex-column");

                userRoom.on("value", function (snap){
                    player2Choice = snap.child("choice").val()
                    if (player2Choice === "paper") {
                        $("#rock2").addClass("d-none");
                        $("#scissors2").addClass("d-none");
                        $("#text-update").text("Player 2 is Ready!")
                    } else if (player2Choice === "rock") {
                        $("#paper2").addClass("d-none");
                        $("#scissors2").addClass("d-none");
                        $("#text-update").text("Player 2 is Ready!")
                    } else if (player2Choice === "scissors") {
                        $("#rock2").addClass("d-none");
                        $("#paper2").addClass("d-none");
                        $("#text-update").text("Player 2 is Ready!")
                    } else {
                        $("#text-update").text("Waiting for other Player")
                    }
                    rpsGame()
                });

                function rpsGame() {
                    if (player1Choice && player2Choice) {
                        if ((player1Choice === "rock" && player2Choice === "scissors") ||
                                (player1Choice === "scissors" && player2Choice === "paper") || 
                                (player1Choice === "paper" && player2Choice === "rock")) {
                                    wins++;
                                    var winDiv = $("<img src=assets/images/win.png width=50px height=50px>");
                                    $("#player1score").append(winDiv);
                                    $("#text-update").text("You Won!")
                                    var nextButton = $("<button id='nextRound' class='btn btn-secondary>Next Round</button>");
                                    $("#text-update").append(nextButton)
                                } else if (player1Choice === player2Choice) {
                                    $("#text-update").text("Draw!")
                                    var nextButton = $("<button id='nextRound' class='btn btn-secondary>Next Round</button>");
                                    nextButton.appendTo("#text-update")
                                } else {
                                    var loseDiv = $("<img src=assets/images/lose.png width=50px height=50px>");
                                    $("#player1score").append(loseDiv);
                                    $("#text-update").text("You Lost!")
                                    var nextButton = $("<button id='nextRound' class='btn btn-secondary>Next Round</button>");
                                    $("#text-update").append(nextButton)
                                }
                    } else if (player1Choice === "undefined" || player1Choice === "undefined") {
                        $("#text-update").text("Still waiting for other Player")
                    }
                    
                };
                
                $("#paper1").on("click", function (event) {
                    // Prevent the page from refreshing
                    event.preventDefault();
                    createRoom.child(gameKey).update({
                        choice: "paper"
                    });
                    player1Choice = "paper"
                    $("#rock1").addClass("d-none");
                    $("#scissors1").addClass("d-none")
                    rpsGame()
                });

                $("#scissors1").on("click", function (event) {
                    // Prevent the page from refreshing
                    event.preventDefault();
                    createRoom.child(gameKey).update({
                        choice: "scissors"
                    });
                    player1Choice = "scissors"
                    $("#rock1").addClass("d-none");
                    $("#paper1").addClass("d-none")
                    rpsGame()
                });
                

                $("#rock1").on("click", function (event) {
                    // Prevent the page from refreshing
                    event.preventDefault();
                    createRoom.child(gameKey).update({
                        choice: "rock"
                    });
                    player1Choice = "rock"
                    $("#paper1").addClass("d-none");
                    $("#scissors1").addClass("d-none")
                    rpsGame()
                });
            
              
            userInQueue.onDisconnect().remove();
            
            
            gameRef.on("value", function (snapshot){
                
            })
                
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


    // queue.child(database.ref("/lobby/user/ready"));
//--- Firebase watcher, listens and executes function when a child element is changed in the chat pathway---

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



