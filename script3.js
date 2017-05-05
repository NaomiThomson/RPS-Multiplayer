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

// Defining variables
var gameObj = {
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

// Initialize database if structure is not already in place
function initDB() {
  db.ref().set({
    chat: {
      chatIn: 0
    },
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
    }
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
    // if player1 has a name, gather all info regarding player1 and store it in variables defined earlier
    // add player1's name to html
    if (snapObj.players.p1.name != 0) {
      gameObj.p1 = snapObj.players.p1.name;
      gameObj.turn1 = snapObj.players.p1.turn;
      gameObj.choice1 = snapObj.players.p1.choice;
      gameObj.p1W = snapObj.players.p1.wins;
      gameObj.p1L = snapObj.players.p1.losses;
      $('#player1').html(snapObj.players.p1.name);
    }
    // if player2 has a name, gather all info regarding player2 and store it in variables defined earlier
    // add player2's name to html
    if (snapObj.players.p2.name != 0) {
      gameObj.p2 = snapObj.players.p2.name;
      gameObj.turn2 = snapObj.players.p2.turn;
      gameObj.choice2 = snapObj.players.p2.choice;
      gameObj.p2W = snapObj.players.p2.wins;
      gameObj.p2L = snapObj.players.p2.losses;
      $('#player2').html(snapObj.players.p2.name);
    }
  };
  // add current scores to html
  updateHTMLScore();
});

$('#add-player').click(function() {

  event.preventDefault();

  var name = $('#player-name').val().trim();

  // if there's no player1, add new player's name to player1's database
  if ($('#player1').is(':empty')) {
    db.ref('players/p1').update({name});
  // if there's no player2, add new player's name to player2's database
  } else if ($('#player2').is(':empty')) {
    db.ref('players/p2').update({name});
  // if there's already 2 players, no one else can join
  } else {
    alert('Can\'t join right now. Sorry, you\'ll have to wait your turn!')
  }
});

// when player1 selects a move, update the database with player1's choice
$('.move1').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p1').update({choice});
  // increase the turn and update the database
  gameObj.turn1++;
  db.ref('players/p1').update({
    turn : gameObj.turn1
  });
  // for any icon that was NOT selected, hide it
  $('.move1').not(this).each(function(){
    $(this).addClass('hidden');
  });
});
// when player2 selects a move, update the database with player2's choice
$('.move2').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p2').update({choice});
  // increase the turn and update the database
  gameObj.turn2++;
  db.ref('players/p2').update({
    turn : gameObj.turn2
  });
  // for any icon that was NOT selected, hide it
  $('.move2').not(this).each(function(){
    $(this).addClass('hidden');
  });
});

// when the submit button is clicked, store the chat input in the database
$('button').click(function() {
  var chatIn = $('#player-chat').val();
  db.ref('chat').update({chatIn});
});

// when player1 logs off, run removeP1 function
$('#p1-exit').click(function() {
  removeP1();
});

// when player2 logs off, run removeP2 function
$('#p2-exit').click(function() {
  removeP2();
});

// if there's a message to display in chat, append it to a new line
// if there's not, empty the chat
db.ref('chat').on('value', function(snapshot) {
  var snapObj = snapshot.val();
  var newMsg = snapObj.chatIn;
  if (newMsg != 0) {
    var chatBox = $('#chat-display');
    chatBox.val(chatBox.val() + newMsg + '\n');
  } else if (newMsg == 0) {
    $('#chat-display').val('');
  }
});

// keep the players' names and choices up-to-date
// if a player logs off, empty the div
db.ref('players').on('value', function(snapshot) {
  var snapObj = snapshot.val();

  gameObj.p1 = snapObj.p1.name;
  gameObj.p2 = snapObj.p2.name;

  if (gameObj.p1 == 0) {
    $('#player1').empty();
  };

  if (gameObj.p2 == 0) {
    $('#player2').empty();
  };

  gameObj.choice1 = snapObj.p1.choice;
  gameObj.choice2 = snapObj.p2.choice;
});

// when player1 takes a turn, update the turn
// then check if the other player selected a move yet
// if the player has, proceed to check game result and start the next round after 3 secs
db.ref('players/p1/turn').on('value', function(snapshot) {

  var p1Turn = snapshot.val();
  gameObj.turn1 = p1Turn;

  if (checkPlayerStatus(gameObj.turn1, gameObj.turn2) == true) {
    updateGameResult(gameObj.choice1,gameObj.choice2);
    setTimeout(nextRound, 3000)
  }
});

// same as above for player2
db.ref('players/p2/turn').on('value', function(snapshot) {

  var p2Turn = snapshot.val();
  gameObj.turn2 = p2Turn;

  //check for turn first, then check game result if both players have chosen
  if (checkPlayerStatus(gameObj.turn1, gameObj.turn2) == true) {
    updateGameResult(gameObj.choice1,gameObj.choice2);
    setTimeout(nextRound, 3000)
  }
});

// check to see if both players have selected a move yet
function checkPlayerStatus(turn1, turn2) {

  if (turn1 == turn2) {
    return true
  } else {
    return false
  }
};

// determine which player won or if it was a tie
function updateGameResult(choice1, choice2) {

  switch(choice1+choice2){
    case 'rr': case 'ss': case 'pp':
      p1p2Tie();
      break
    case 'rs': case 'pr': case 'sp':
      p1Wins();
      break
    case 'sr': case 'rp': case 'ps':
      p2Wins();
      break
  };
};

// when both players have selected a move, display on both players' screens what each player chose
function displayChoices() {
  var p1Move = gameObj.choice1;
  var p2Move = gameObj.choice2;
  $('.move1').each(function() {
    if ($(this).attr('data-move') != p1Move) {
      $(this).addClass('hidden');
    }
  });
  $('.move2').each(function() {
    if ($(this).attr('data-move') != p2Move) {
      $(this).addClass('hidden');
    }
  });
};

function p1p2Tie() {
  $('#game-result').html(('tie!'));
  displayChoices();
};

function p1Wins() {
  $('#game-result').html((gameObj.p1 + ' wins!'));
  gameObj.p1W++;
  gameObj.p2L++;
  db.ref('players').update({
    'p1/wins' : gameObj.p1W,
    'p2/losses' : gameObj.p2L
  });
  displayChoices();
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
  displayChoices();
  updateHTMLScore();
};

function updateHTMLScore() {
  $('#wins1').html('Wins: ' + gameObj.p1W);
  $('#losses1').html('Losses: ' + gameObj.p1L);
  $('#wins2').html('Wins: ' + gameObj.p2W);
  $('#losses2').html('Losses: ' + gameObj.p2L);
}

// when next round starts, empty the game result div
// remove the hidden classes from the previously hidden icons
function nextRound() {
  $('#game-result').empty();
  $('.move1').each(function() {
    if ($(this).hasClass('hidden')) {
      $(this).removeClass('hidden');
    }
  });
  $('.move2').each(function() {
    if ($(this).hasClass('hidden')) {
      $(this).removeClass('hidden');
    }
  });
};

// when player1 logs off, clear all player1 info
// also clear the chat log
function removeP1() {
  db.ref('players/p1').update({
    choice : 0,
    losses : 0,
    name : 0,
    turn : 0,
    wins: 0
  });
  db.ref('players/p2').update({
    turn : 0,
    losses : 0,
    wins : 0
  });
  db.ref('chat').update({chatIn:0});
  $('#player1').empty();
  $('#wins1').empty();
  $('#losses1').empty();
};

// same as above for player2
function removeP2() {
  db.ref('players/p2').update({
    choice : 0,
    losses : 0,
    name : 0,
    turn : 0,
    wins: 0
  });
  db.ref('players/p1').update({
    turn : 0,
    losses : 0,
    wins : 0
  });
  db.ref('chat').update({chatIn:0});
  $('#player2').empty();
  $('#wins2').empty();
  $('#losses2').empty();
}
