// Multi.js

// Todo:
// OK, Time out, wrong. 5/3/1
// Nice style table. Red, yellow, green?
// Export / Send result by mail.
// More options
// Nr of questions - mode
// Time - mode
// Tips: utifrån vilket tal som missas så visas relevanta tips på hur
//       det går att tänka på just detta tal.

// Bugs:
// Table display on wrong ansers after cutoff time.


"use strict";

let antalRatt = 0;
let antalFel = 0;
let ratt = matrix(11,11,0);
let fel = matrix(11,11,0);
let tidfel = matrix(11,11,0);
let status = matrix(11,11,0);
let msgSvar = ``;
let countdown = 4;

const MODE_DISABLED = 0;
const MODE_TIMER = 1;
const MODE_NR = 2;
const MODE_FOREVER = 3;
let mode = MODE_FOREVER;


let modeTotalNr = 0;
let modeCurrentNr = 0;
let modeRattNr = 0;

let modeCurrentTime = 0;
let modeTotalTime = 0;
let modeRattTime = 0;
let modeQuestionsTime = 0;

const ENABLED = 0;
const DISABLED = 1;

let countdownTimeRunning = ENABLED;
var countdownTime = 0;

let multiplikator =  Math.floor((Math.random() * 11));
let multiplikand =  Math.floor((Math.random() * 11));

if (document.cookie != "") {
  antalRatt = JSON.parse(getCookie("antalRatt"));
  antalFel = JSON.parse(getCookie("antalFel"));
  ratt = JSON.parse(getCookie("ratt"));
  fel = JSON.parse(getCookie("fel"));
  tidfel = JSON.parse(getCookie("tidfel"));
  status = JSON.parse(getCookie("status"));
  updateScore();
  updateStatus();
}


newQuestion();
document.getElementById("tableResultat").style.visibility = "hidden";
document.getElementById("rattFel").innerHTML = `Hej! Denna sida anv&auml;nder cookies.`;


function questionModeNr(nrQuestions) {
  document.getElementById("guessText").focus();
  if (mode == MODE_NR) {
    modeCurrentNr = nrQuestions;
    modeRattNr = 0;
  } else {
    mode = MODE_NR;
    modeRattNr = 0;
    modeTotalNr = nrQuestions;
    modeCurrentNr = 1;
    newQuestion();
  }
  document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
  document.getElementById("rattFel").innerHTML = "Utmaning: " + nrQuestions + " fr&aring;gor";
}

function questionModeForever() {
  mode = MODE_FOREVER;
  newQuestion();
  document.getElementById("rattFel").innerHTML = "Sandbox"
  document.getElementById("guessText").focus();

}

function questionModeTimer(duration) {
  document.getElementById("guessText").focus();
  if (mode == MODE_TIMER) {
    modeCurrentTime = duration;
    modeRattTime = 0;
    modeQuestionsTime = 0;
  } else {
    mode = MODE_TIMER;
    modeCurrentTime = duration;
    newQuestion();
    var textOut
    var timerInterval = setInterval(function ()
    {
        textOut = modeCurrentTime < 10 ? "0" + modeCurrentTime : modeCurrentTime;
        document.querySelector("#question").textContent = "Utmaning: " + textOut + " sekunder";
        document.getElementById("guessText").focus();
        if (--modeCurrentTime < 0) {
          mode = MODE_DISABLED;
          modeCurrentTime = 0;
          document.getElementById("rattFel").innerHTML = 'Utmaningstiden &auml;r slut! Du hade ' + modeRattTime + " r&auml;tt av " + modeQuestionsTime;
          document.getElementById("fraga").style.visibility = "hidden";
          document.getElementById("guessText").style.visibility = "hidden";
          clearInterval(timerInterval);
        }

    }, 1000);
  }
  document.getElementById("rattFel").innerHTML = "Utmaning: " + duration + " sekunder";
}


function countdownTimer(duration, display) {
    countdownTime = duration;
    countdownTimeRunning = ENABLED;
    var seconds;
    setInterval(function () {
        seconds = countdownTime;

        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "Uppgift: " + seconds + " sekunder";

        if (--countdownTime < 0) {
          // Tidfel
          if (countdownTimeRunning == ENABLED) {
            tidfel[multiplikator][multiplikand] = tidfel[multiplikator][multiplikand] + 1;
            countdownTime = 0; //duration
            countdownTimeRunning = DISABLED;
            document.getElementById("guessText").style.backgroundColor = "LemonChiffon";
            document.getElementById("fraga").style.color = "LemonChiffon";
          } else {
            countdownTime = 0;
          }
        }
    }, 1000);
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onload = function () {
    var display = document.querySelector('#time');
    countdownTimer(countdown, document.querySelector('#time'));
};


// Växlar om tabllen visas eller ej samt ger guessText fokus
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
  if (mode != MODE_DISABLED){
    document.getElementById("fraga").style.visibility = "visible";
    document.getElementById("guessText").style.visibility = "visible";

    var i = 0;
    while (i < 300) {
      multiplikator = Math.floor((Math.random() * 11));
      multiplikand = Math.floor((Math.random() * 11));
      if (getStatus(multiplikator, multiplikand) == ENABLED) { break; }
      i++;
    }

    document.getElementById("fraga").innerHTML = `${multiplikator} &middot; ${multiplikand} =`;
    document.getElementById("guessText").value = "";
    document.getElementById("rattFel").innerHTML = `${msgSvar}`;
    document.getElementById("rattTotalt").innerHTML = "Totalt: " + `${antalRatt}` +
      " r&auml;tt av " + `${antalRatt+antalFel}`;

    countdownTime = countdown;
    countdownTimeRunning = ENABLED;
    document.getElementById("guessText").style.backgroundColor = "white";
    document.getElementById("fraga").style.color = "white";


    setCookie("antalRatt", JSON.stringify(antalRatt), 3);
    setCookie("antalFel", JSON.stringify(antalFel), 3);
    setCookie("ratt", JSON.stringify(ratt), 3);
    setCookie("fel", JSON.stringify(fel), 3);
    setCookie("tidfel", JSON.stringify(tidfel), 3);
    setCookie("status", JSON.stringify(status), 3);
  } else {
    // No mode
    document.getElementById("fraga").style.visibility = "hidden";
    document.getElementById("guessText").style.visibility = "hidden";
  }
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

function textChange() {
  var guessText = document.getElementById("guessText").value;
  if (guessText.length >= String(multiplikator*multiplikand).length) {
    guess();
  }
}

// testar om gissning stämmer med frågan, kallar newQuestion och updateScore
function guess()
{
  var guessText = document.getElementById("guessText").value;

  if (guessText == "") {
    return;
  }
  if (mode == MODE_TIMER) {modeQuestionsTime++};

  if (guessText == multiplikator * multiplikand) {
    if (countdownTimeRunning == ENABLED){
      const alternativRatt = [`Korrekt!`,`R&auml;tt!`,`Snyggt!`,`Utm&auml;rkt!`,`Exakt!`,`Bra!`,`Forts&auml;tt s&aring; h&auml;r!`]
      msgSvar = alternativRatt[Math.floor((Math.random() * alternativRatt.length))];
      document.getElementById("rattFel").style.color = "Lavender"
    } else {
      const alternativTid = [`R&auml;tt men inte s&aring; snabbt`,`Lite snabbare kan du`]
      msgSvar = alternativTid[Math.floor((Math.random() * alternativTid.length))];
      document.getElementById("rattFel").style.color = "LemonChiffon"
    }
    antalRatt++;
    if (mode == MODE_TIMER) { modeRattTime++ };
    if (mode == MODE_NR) { modeRattNr++ };
    ratt[multiplikator][multiplikand]=ratt[multiplikator][multiplikand] + 1;
  } else {
    msgSvar = `Inte riktigt, &nbsp; ${multiplikator} &middot; ${multiplikand} = ${multiplikator * multiplikand}` ; // Fel svar
    document.getElementById("rattFel").style.color = "MistyRose"
    antalFel++;
    fel[multiplikator][multiplikand]=fel[multiplikator][multiplikand] + 1;
  }

  if (mode == MODE_NR) {
    modeCurrentNr ++;
    document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
    if (modeCurrentNr > modeTotalNr) {
        mode = MODE_DISABLED;
        modeCurrentNr = modeTotalNr;
        document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
        document.getElementById("rattFel").innerHTML = 'Det var sista fr&aring;gan! Du hade ' + modeRattNr + " r&auml;tt av " + modeTotalNr;
    } else {
      document.querySelector("#question").textContent = "Utmaning: " + modeCurrentNr + "/" + modeTotalNr;
      newQuestion();
    }
  } else {
    newQuestion();
  }

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
        document.getElementById("d"+j+"x"+i).innerHTML =
        (ratt[j][i] - tidfel[j][i]) + "/" + tidfel[j][i] + "/" + fel[j][i];
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
  updateStatus();
  updateScore();
  document.getElementById("rattTotalt").innerHTML = "";
}
