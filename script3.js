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
  p1 : '',
  p2 : '',
  turn1 : 0,
  turn2 : 0,
  choice1 : 0,
  choice2 : 0,
  p1W : 0,
  p2W : 0,
  p1L : 0,
  p2L: 0
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
      gameObj.p1 = snapObj.players.p1.name;
      gameObj.turn1 = snapObj.players.p1.turn;
      gameObj.choice1 = snapObj.players.p1.choice;
      gameObj.p1W = snapObj.players.p1.wins;
      gameObj.p1L = snapObj.players.p1.losses;
      $('#player1').html(snapObj.players.p1.name);
    }

    if (snapObj.players.p2.name != 0) {
      gameObj.p2 = snapObj.players.p2.name;
      gameObj.turn2 = snapObj.players.p2.turn;
      gameObj.choice2 = snapObj.players.p2.choice;
      gameObj.p2W = snapObj.players.p2.wins;
      gameObj.p2L = snapObj.players.p2.losses;
      $('#player2').html(snapObj.players.p2.name);
    }
  }

  updateHTMLScore();
});

$('#add-player').click(function() {

  event.preventDefault();

  var name = $('#player-name').val().trim();

  if ($('#player1').is(':empty')) {
    db.ref('players/p1').update({name});
  } else if ($('#player2').is(':empty')) {
    db.ref('players/p2').update({name});
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
    updateGameResult(gameObj.choice1,gameObj.choice2);
  } else {
    console.log('wait');
  }
});

db.ref('players/p2/turn').on('value', function(snapshot) {

  var p2Turn = snapshot.val();
  gameObj.turn2 = p2Turn;

  //check for turn first, then check game result if both players have chosen
  if (checkPlayerStatus(gameObj.turn1, gameObj.turn2) == true) {
    updateGameResult(gameObj.choice1,gameObj.choice2);
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

function updateGameResult(choice1, choice2) {

  switch(choice1+choice2){
    case 'rr': case 'ss': case 'pp':
      $('#game-result').html(('tie!'));
      break
    case 'rs': case 'pr': case 'sp':
      p1Wins();
      break
    case 'sr': case 'rp': case 'ps':
      p2Wins();
      break
  };
};

function displayChoices() {

}

function p1Wins() {
  $('#game-result').html((gameObj.p1 + ' wins!'));
  gameObj.p1W++;
  gameObj.p2L++;
  db.ref('players').update({
    'p1/wins' : gameObj.p1W,
    'p2/losses' : gameObj.p2L
  });
  updateHTMLScore();
};

function p2Wins() {
  $('#game-result').html((gameObj.p2 + ' wins!'));
  gameObj.p1L++;
  gameObj.p2W++;
  db.ref('players').update({
    'p1/losses' : gameObj.p1L,
    'p2/wins' : gameObj.p2W
  });
  updateHTMLScore();
};

function updateHTMLScore() {
  $('#wins1').html('Wins: ' + gameObj.p1W);
  $('#losses1').html('Losses: ' + gameObj.p1L);
  $('#wins2').html('Wins: ' + gameObj.p2W);
  $('#losses2').html('Losses: ' + gameObj.p2L);
}
