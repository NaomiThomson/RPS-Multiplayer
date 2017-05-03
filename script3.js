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

gameObj = {
  turn1 : 0,
  turn2 : 0,
  choice1 : 0,
  choice2 : 0
};

db = firebase.database();

function initDB() {
  db.ref().set({
    chat: 0,
    players: {
      p1: {
        name: 0,
        choice: 0,
        losses: 0,
        wins: 0,
        turn: 0
      },
      p2: {
        name: 0,
        choice: 0,
        losses: 0,
        wins: 0,
        turn: 0
      }
    },
    turn: 0
  });
};

// Will only fire once if database doesn't exist
db.ref().once("value", function(snapshot) {
  var snapObj = snapshot.val();

  if (snapshot.child('players').exists()) {
    console.log('all good');
  } else {
    initDB();
  }
});

// At the initial load, get a snapshot of the current data.
db.ref().on("value", function(snapshot) {
  var snapObj = snapshot.val();


  if (snapshot.child('players').exists()) {
    if (snapObj.players.p1.name != 0) {
      $('#player1').html(snapObj.players.p1.name)
    }

    if (snapObj.players.p2.name != 0) {
      $('#player2').html(snapObj.players.p2.name)
    }

  }


});

$('#add-player').click(function() {

  event.preventDefault();

  var name = $('#player-name').val().trim();

  if ($('#player1').is(':empty')) {
    db.ref('players/p1').update({name})
  } else if ($('#player2').is(':empty')) {
    db.ref('players/p2').update({name})
  } else {
    alert('Can\'t join right now, sorry!')
  }
});


$('.move1').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p1').update({choice});

  gameObj.turn1++;
  db.ref('players/p1').update({
    turn : gameObj.turn1
  })
});

$('.move2').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p2').update({choice});

  gameObj.turn2++;
  db.ref('players/p2').update({
    turn : gameObj.turn2
  })
});


db.ref('players').on('value', function(snapshot) {
  var snapObj = snapshot.val();

  gameObj.choice1 = snapObj.p1.choice;
  gameObj.choice2 = snapObj.p2.choice;

});

db.ref('players/p1/turn').on('value', function(snapshot) {

  var p1Turn = snapshot.val();
  gameObj.turn1 = p1Turn;

  //check for turn first, then check game result if both players have chosen
  if (checkPlayerStatus(gameObj.turn1, gameObj.turn2) == true) {
    checkGameResult(gameObj.choice1,gameObj.choice2);
  } else {
    console.log('wait');
  }
});

db.ref('players/p2/turn').on('value', function(snapshot) {

  var p2Turn = snapshot.val();
  gameObj.turn2 = p2Turn;

  //check for turn first, then check game result if both players have chosen
  if (checkPlayerStatus(gameObj.turn1, gameObj.turn2) == true) {
    checkGameResult(gameObj.choice1,gameObj.choice2);
  } else {
    console.log('wait');
  }
});

function checkPlayerStatus(turn1, turn2) {
  // check to see if both players have chosen yet
  if (turn1 == turn2) {
    console.log('true');
    return true
  } else {
    console.log('false');
    return false
  }
}

function checkGameResult(choice1, choice2) {

  switch(choice1+choice2){
    case 'rr': case 'ss': case 'pp':
      console.log('tie');
      break
    case 'rs': case 'sr':
      console.log('rock');
      break
    case 'rp': case 'pr':
      console.log('paper');
      break
    case 'sp' : case 'ps':
      console.log('scissors');
      break
  };

}
