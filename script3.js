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

    console.log(snapObj.players.p1.name);
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
  } else {
    db.ref('players/p2').update({name})
  }
});

$('.move1').click(function() {
  console.log($(this).attr('data-move'));
})
