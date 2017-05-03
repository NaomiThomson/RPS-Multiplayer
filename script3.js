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


db = firebase.database();

function initDB() {
  db.ref().set({
    chat: 0,
    players: {
      p1: {
        name: 0,
        choice: 0,
        losses: 0,
        wins: 0
      },
      p2: {
        name: 0,
        choice: 0,
        losses: 0,
        wins: 0
      }
    },
    turn: 0
  });
}

// Will only fire once if database doesn't exist
db.ref().once("value", function(snapshot) {
  var snapObj = snapshot.val();

  try {
    console.log(snapObj.players);
  }
  catch(e) {
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
  db.ref('players/p1').update({choice})
});

$('.move2').click(function() {
  var choice = $(this).attr('data-move');
  db.ref('players/p2').update({choice});
});

db.ref().on('child_changed', function(snapshot) {
  var snapObj = snapshot.val();
  console.log(snapObj);
  var p1 = snapObj.p1.choice;
  var p2 = snapObj.p2.choice;
  console.log(p1,p2);
  checkGameResult(p1,p2);
})

function checkPlayerStatus() {
  // check to see if other player has chosen yet
}

function checkGameResult(choice1, choice2) {

  console.log(choice1);
  console.log(choice2);

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
  };

  // switch (player1Choice) {
  //
  //   case player1Choice == player2Choice:
  //     $('#game-result').html('Tie!');
  //     break;
  //
  //   case player1Choice == 'r' && player2Choice == 'p':
  //     console.log('p2 wins');
  //     break;
  //
  //   case player1Choice == 'r' && player2Choice == 's':
  //     console.log('p1 wins');
  //     break;
  //
  //   case player1Choice == 'p' && player2Choice == 'r':
  //     console.log('p1 wins');
  //     break;
  //
  //   case player1Choice == 'p' && player2Choice == 's':
  //     console.log('p2 wins');
  //     break;
  //
  //   case player1Choice == 's' && player2Choice == 'p':
  //     console.log('p1 wins');
  //     break;
  //
  //   case player1Choice == 's' && player2Choice == 'r':
  //     console.log('p2 wins');
  //     break;
  //
  // }
}
