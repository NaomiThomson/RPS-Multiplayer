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

var count1 = 0;
var count2 = 0;

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
}

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

  count1++;
  db.ref('players/p1').update({
    turn : count1
  })
});

$('.move2').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p2').update({choice});

  count2++;
  db.ref('players/p2').update({
    turn : count2
  })
});


db.ref('players').on('value', function(snapshot) {
  var snapObj = snapshot.val();

  var p1Choice = snapObj.p1.choice;
  var p2Choice = snapObj.p2.choice;

  var p1Turn = snapObj.p1.turn;
  var p2Turn = snapObj.p2.turn;

  //check for turn first, then check game result if both players have chosen
  if (checkPlayerStatus(p1Turn, p2Turn) == true) {
    checkGameResult(p1Choice,p2Choice);
  } else {
    console.log('wait');
  }

})

function checkPlayerStatus(turn1, turn2) {
  // check to see if both players have chosen yet
  if (turn1 == turn2) {
    return true
  } else {
    return false
  }
}

function checkGameResult(choice1, choice2) {

  if(choice1==choice2) console.log('Tie!');
  switch(choice1+choice2){
    case 'rs': case 'sr':
      console.log('rock');
      break
    case 'rp': case 'pr':
      console.log('paper');
      break
    case 'sp' : case 'ps':
      console.log('scissors');
      break
    default:
      console.log('waiting on other player');
  };

}
