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

//----Sets up pathways for users and chat----
var lobbyRef = database.ref("/lobby")
var chatRef = database.ref("/chat")
var userChat
var queueRef = database.ref("/queue")
var queueNum
var gameRef = database.ref("/games");
var gameNum = 0
var player1Key = ""
var choice = ""
var player2Key = ""
var player1Choice = ""
var player2Choice = ""
var player1Ready = true;
var player2Ready = true;
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
//--------------
var username = "";
var ready = "";
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
    gameRef.on("child_added", function (snapshot) {
        gameNum = snapshot.numChildren();
        console.log("Number of Game Rooms: " + gameNum)
    });
    queueRef.on("value", function (snapshot) {
        queueNum = snapshot.numChildren();
        console.log("Users in Queue: " + queueNum)
        if (queueNum >= 2) {
            userInQueue.remove();
            var gameRoom = gameRef.child("Room" + gameNum);
            var players = gameRoom.push({
                choice: choice,
                wins: wins,
                ready: true,
            });
            player1Key = players.key
            console.log("Your room is called " + player1Key + " .")
            gameRoom.onDisconnect().remove();

            gameRoom.on("child_added", function (snap) {
                if (player1Key != snap.key) {
                    player2Key = snap.key;
                    console.log("Your opponnents room is called " + player2Key + " .")
                    gameRoom.off("child_added")

                    gameRoom.child(player2Key).child("choice").on("value", function (snap) {
                        console.log("======PLAYER 2====")
                        player2Choice = snap.val();
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
                        }
                        rpsGame();
                        console.log(snap.val())
                        console.log(player2Key);
                    });

                    gameRoom.child(player2Key).child("ready").on("value", function (snap) {
                        player2ready = snap.val();
                    });
                }
            });

            queueRef.off("value");
            $("#gameplay").removeClass("d-none");
            $("#score").removeClass("d-none");
            $("#chatBox").removeClass("d-none");
            $("#gameplay").addClass("d-flex");
            $("#score").addClass("d-flex");
            $("#chatBox").addClass("d-flex flex-column");

            function rpsGame() {
                if (player1Choice && player2Choice) {
                    if ((player1Choice === "rock" && player2Choice === "scissors") ||
                        (player1Choice === "scissors" && player2Choice === "paper") ||
                        (player1Choice === "paper" && player2Choice === "rock")) {
                        wins++;
                        var winDiv = $("<img src=assets/images/win.png width=50px height=50px class=m-2>");
                        var loseDiv = $("<img src=assets/images/lose.png width=50px height=50px  class=m-2>");
                        $("#player1score").append(winDiv);
                        $("#player2score").append(loseDiv);
                        $("#text-update").text("You Won!")
                        var nextButton = $("<button id='nextRound' class='btn btn-secondary ml-4'>Next Round</button>");
                        $("#text-update").append(nextButton)
                    } else if (player1Choice === player2Choice) {
                        $("#text-update").text("Draw!")
                        var nextButton = $("<button id='nextRound' class='btn btn-secondary ml-4'>Next Round</button>");
                        $("#text-update").append(nextButton)
                    } else if (player2Choice == "") {
                        $("#text-update").text("Still Waiting on other Player")
                    } else {
                        var loseDiv = $("<img src=assets/images/lose.png width=50px height=50px class=m-2>");
                        var winDiv = $("<img src=assets/images/win.png width=50px height=50px class=m-2>");
                        $("#player1score").append(loseDiv);
                        $("#player2score").append(winDiv);
                        $("#text-update").text("You Lost!")
                        var nextButton = $("<button id='nextRound' class='btn btn-secondary ml-4'>Next Round</button>");
                        $("#text-update").append(nextButton)
                    }

                    $("#nextRound").on("click", function () {
                        player1ready = true;
                        gameRoom.child(player1Key).update({
                            ready: true,
                            choice: "",
                        });
                        gameRoom.child(player2Key).update({
                            choice: ""
                        });
                        gameRoom.child(player2Key).child("choice").on("value", function (snap) {
                            player2Choice = snap.val();
                        });
                        gameRoom.child(player1Key).child("choice").on("value", function (snap) {
                            player1Choice = snap.val();
                        });
                        gameRoom.child(player2Key).child("ready").on("value", function (snap) {
                            player2Ready = snap.val()
                            console.log(player2Ready);
                            checkReady();
                        });
                        gameRoom.child(player1Key).child("ready").on("value", function (snap) {
                            player1Ready = snap.val()
                            console.log(player1Ready);
                            checkReady();
                        });
                        function checkReady() {
                            if (player2ready && player1Ready) {
                                $("#paper1").removeClass("d-none");
                                $("#scissors1").removeClass("d-none");
                                $("#rock1").removeClass("d-none");
                                $("#paper2").removeClass("d-none");
                                $("#scissors2").removeClass("d-none");
                                $("#rock2").removeClass("d-none");
                                nextButton.remove();
                                $("#text-update").text("You Won " + wins + " times");
                                rps();
                            } else {
                                $("#text-update").text("Waiting for Next Round");
                            }
                        }
                    });
                };
            }


            $("#paper1").on("click", function (event) {
                // Prevent the page from refreshing
                event.preventDefault();
                gameRoom.child(player1Key).update({
                    choice: "paper"
                });
                player1Choice = "paper"
                console.log("player 1 choice: " + player1Choice)
                console.log("player 2 choice: " + player2Choice)
                $("#rock1").addClass("d-none");
                $("#scissors1").addClass("d-none")
                gameRoom.child(player1Key).update({
                    ready: false
                });
                rpsGame()
            });

            $("#scissors1").on("click", function (event) {
                // Prevent the page from refreshing
                event.preventDefault();
                gameRoom.child(player1Key).update({
                    choice: "scissors"
                });
                player1Choice = "scissors"
                console.log("player 1 choice: " + player1Choice)
                console.log("player 2 choice: " + player2Choice)
                $("#rock1").addClass("d-none");
                $("#paper1").addClass("d-none");
                gameRoom.child(player1Key).update({
                    ready: false
                });

                rpsGame()
            });


            $("#rock1").on("click", function (event) {
                // Prevent the page from refreshing
                event.preventDefault();
                gameRoom.child(player1Key).update({
                    choice: "rock"
                });
                player1Choice = "rock"
                console.log("player 1 choice: " + player1Choice)
                console.log("player 2 choice: " + player2Choice)
                $("#paper1").addClass("d-none");
                $("#scissors1").addClass("d-none");
                gameRoom.child(player1Key).update({
                    ready: false
                });
                rpsGame()
            });
        }

        userInQueue.onDisconnect().remove();


        gameRef.on("value", function (snapshot) {

        })

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



