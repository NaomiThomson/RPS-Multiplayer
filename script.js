// Initialize Firebase
var config = {
  apiKey: "AIzaSyDx-LUA8sZ6DzKHCjQGgbMdTHFuy2pPdms",
  authDomain: "rps-multiplayer-527c3.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-527c3.firebaseio.com",
  projectId: "rps-multiplayer-527c3",
  storageBucket: "rps-multiplayer-527c3.appspot.com",
  messagingSenderId: "424046617985"
};
firebase.initializeApp(config);

// Create a variable to reference the database
db = firebase.database();

// At the initial load, get a snapshot of the current data.
// db.ref().on("child_added", function(snapshot) {
//   var snapObj = snapshot.val();
//
//   console.log(snapObj);
//
//   $('#player1').html(snapObj.player);
//   $('#player2').html(snapObj.player);
//
// });

db.ref().orderByChild("dateAdded").limitToFirst(1).on("child_added", function(snapshot) {

  var snapObj = snapshot.val();
  $('#player1').html(snapObj.player);

});

db.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

  var snapObj = snapshot.val();
  $('#player2').html(snapObj.player);

});

$('#add-player').click(function() {

  event.preventDefault();

  var name = $('#player-name').val().trim();

  db.ref().push({
    player : name,
  });

  // firebase.database().ref('users/').set({
  //   username: name,

  // $('#player1').html(name);
});


$('#send-msg').click(function() {
  event.preventDefault();

  var msg = $('#player-chat').val().trim();

  db.ref('-Kj0RyjI0z4box-1ExlI').update({
    latestChat : msg
  })


})

// function go() {
//   var userId = $('#player-name').val().trim();
//   var gameRef = new Firebase(game_location);
//   assignNumberplayGame(userId, gameRef)
// };
//
// var max_players = 2;
//
// var game_location = 'https://rps-multiplayer-527c3.firebaseio.com/';
//
// var players_location = 'player_list';
//
// var player_data_location = 'player_data';
//
// function playGame(playerNumber, userId, joinedGame, gameRef) {
//   var playerDataRef = gameRef.child(player_data_location).child(playerNumber);
//   console.log('you are player number ' + playerNumber + '. Your data will be located at ' + playerDataRef.toString());
//
//   if (joinedGame) {
//     console.log('first time initialization of data');
//     playerDataRef.set({userId: userId, state: 'game state'})
//   }
// };
//
// var playerListRef = gameRef.child(players_location);
// var playerNumber, alreadyInGame = false;
//
// playerListRef.transaction(function(playerList) {
//   if (playerList === null) {
//     playerList = [];
//   }
//
//   for (var i = 0; i < playerList.length; i++) {
//     if (playerList[i] === userId) {
//       alreadyInGame = true;
//       playerNumber = i;
//       return;
//     }
//   }
//
//   if (i < max_players) {
//     playerList[i] = userId;
//     playerNumber = i;
//     return playerList;
//   }
//
//   playerNumber = null;
// }, function(error, committed) {
//   if (committed || alreadyInGame) {
//     playGame(playerNumber, userId, !alreadyInGame, gameRef);
//   } else {
//     console.log('Game is full. Can\'t join.');
//   }
// }
// })
