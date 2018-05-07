"use strict";

let antalRatt = 0;
let antalFel = 0;
let ratt = matrix(11,11,0);
let fel = matrix(11,11,0);
let status = matrix(11,11,0);
let msgSvar = ``;
const ENABLED = 0;
const DISABLED = 1;

let multiplikator =  Math.floor((Math.random() * 11));
let multiplikand =  Math.floor((Math.random() * 11));

newQuestion();
document.getElementById("tableResultat").style.visibility = "hidden";
document.getElementById("rattFel").innerHTML = `Hej!`;



// Växlar om tabllen visas eller ej
function toggleTable() {
  if (document.getElementById("tableResultat").style.visibility == "hidden") {
    document.getElementById("tableResultat").style.visibility = "visible";
  } else {
    document.getElementById("tableResultat").style.visibility = "hidden";
  }
  document.getElementById("guessText").focus();

}

// Slumpar en ny fråga och uppdaterar textfält.
function newQuestion() {
  var i = 0;
  while (i < 300) {
    multiplikator = Math.floor((Math.random() * 11));
    multiplikand = Math.floor((Math.random() * 11));
    if (getStatus(multiplikator, multiplikand) == ENABLED) { break; }
    i++;
  }

  document.getElementById("fraga").innerHTML = `${multiplikator} &middot; ${multiplikand}`;
  document.getElementById("guessText").value = "";
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  document.getElementById("ratt").innerHTML = `${antalRatt}`;
  document.getElementById("totalt").innerHTML = `${antalRatt+antalFel}`;
}

// Skapar en 2D-matris
function matrix (numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

// testar om gissning stämmer med frågan, kallar newQuestion och updateScore
function guess()
{
  var guessText = document.getElementById("guessText").value;

  if (guessText == "") {return;}

  if (guessText == multiplikator * multiplikand) {
    const alternativ = [`Korrekt!`,`R&auml;tt!`,`Snyggt!`,`Utm&auml;rkt!`,`Exakt!`,`Bra!`,`Forts&auml;tt s&aring; h&auml;r!`]
    msgSvar = alternativ[Math.floor((Math.random() * 7))];
    //msgSvar = `Korrekt.`; // Rätt svar
    antalRatt++;
    ratt[multiplikator][multiplikand]=ratt[multiplikator][multiplikand] + 1;
  } else {
    msgSvar = `Inte riktigt. &nbsp; ${multiplikator} &middot; ${multiplikand} = ${multiplikator * multiplikand}` ; // Fel svar
    antalFel++;
    fel[multiplikator][multiplikand]=fel[multiplikator][multiplikand] + 1;
  }

  newQuestion();
  updateScore();
  document.getElementById("guessText").focus();

}

//ändrar status om ett visst par ska inkluderas eller ej.
function changeStatus(a,b,newStatus) {
  if (arguments.length == 3) {
    status[a][b]=newStatus;
    if (newStatus == DISABLED && multiplikator == a && multiplikand == b) {
      newQuestion();
    }
  } else {
    status[a][b]=status[a][b]+1;
    if (status[a][b] > 1) {
      status[a][b] = 0;
    }
    if (status[a][b] == DISABLED && multiplikator == a && multiplikand == b) {
      newQuestion();
    }
  }
  updateStatus(a,b);
}


//Status lätta hörnet
function statusEasy() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}
function statusLevel1() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 0; i<3;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (var j = 0; j<3;++j) {
    for (var i = 3; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (var j = 3; j<11;++j) {
      changeStatus(10,j,ENABLED);
      changeStatus(j,10,ENABLED);
  }
  updateStatus();
}

function statusMedium() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  updateStatus();

}

function statusMediumOnly() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  updateStatus();
}

function statusHard() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}

function statusHardOnly() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  updateStatus();
}

function statusSvaraHornet() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,DISABLED);
    }
  }
  for (var j = 6; j<10;++j) {
    for (var i = 6; i<10;++i) {
      changeStatus(i,j,ENABLED);
    }
  }
  newQuestion();
  updateStatus();
}

function statusRemoveGreen() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      if (fel[j][i] == 0 && ratt[j][i]>0) {
        changeStatus(j,i,DISABLED) ;
      }
    }
  }
  updateStatus();
}

function changeStatusRow(a) {
  for (var i = 0; i<11;++i) {
    changeStatus(a,i);
  }
  updateStatus();
}

function changeStatusColumn(b) {
  for (var i = 0; i<11;++i) {
    changeStatus(i,b);
  }
  updateStatus();
}

function changeStatusAll() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j);
    }
  }
  updateStatus();
}

function getStatus(a,b) {
  return status[a][b];
}

// Uppdaterar hur tabellen med resultat ser ut
function updateStatus(j,i) {
  if (arguments.length == 0) {
    for (var j = 0; j < 11; j++) {
      for (var i = 0; i < 11; i++) {
        if (status[j][i] == ENABLED) {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "white";
        } else {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgrey";
        }
      }
    }
  } else {
    if (status[j][i] == ENABLED) {
      document.getElementById("d"+j+"x"+i).style.backgroundColor = "white";
    } else {
      document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgrey";
    }
  }
  document.getElementById("guessText").focus();
}


// uppdaterar innehållet i tabllen (poängräkningen)
function updateScore() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      if (ratt[j][i] + fel[j][i] == 0) {
        document.getElementById("d"+j+"x"+i).innerHTML = "";
      } else {
        document.getElementById("d"+j+"x"+i).innerHTML = ratt[j][i] + " / " + (ratt[j][i] + fel[j][i]);
        if (fel[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.color = "darkgreen";
        } else if (ratt[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.color = "red";
        } else {
          document.getElementById("d"+j+"x"+i).style.color = "black";
        }
      }
    }
  }
}

//Nollställer poängräkningen och kör updateScore()
function resetScore() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      fel[i][j] = 0;
      ratt[i][j] = 0;
    }
  }
  antalFel = 0;
  antalRatt = 0;
  updateScore();
}
