"use strict";

let antalRatt = 0;
let antalFel = 0;
let ratt = matrix(11,11,0);
let fel = matrix(11,11,0);
let status = matrix(11,11,0);
let msgSvar = ``;

let multiplikator =  Math.floor((Math.random() * 11));
let multiplikand =  Math.floor((Math.random() * 11));

nyFraga();


function toggleTable() {
  if (document.getElementById("tableResultat").style.visibility == "hidden") {
    document.getElementById("tableResultat").style.visibility = "visible";
  } else {
    document.getElementById("tableResultat").style.visibility = "hidden";
  }
}
function nyFraga() {
  while (true) {
    multiplikator = Math.floor((Math.random() * 11));
    multiplikand = Math.floor((Math.random() * 11));
    if (getStatus(multiplikator, multiplikand) == 0) { break; }
  }

  document.getElementById("fraga").innerHTML = `${multiplikator} &middot; ${multiplikand}`;
  document.getElementById("gissningText").value = "";
  document.getElementById("rattFel").innerHTML = `${msgSvar}`;
  document.getElementById("ratt").innerHTML = `${antalRatt}`;
  document.getElementById("totalt").innerHTML = `${antalRatt+antalFel}`;
}
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


function gissning()
{
  var gissningText = document.getElementById("gissningText").value;

  if (gissningText == "") {return;}

  if (gissningText == multiplikator * multiplikand) {
    msgSvar = 'R&auml;tt svar!'; // Rätt svar
    antalRatt++;
    ratt[multiplikator][multiplikand]=ratt[multiplikator][multiplikand] + 1;
  } else {
    msgSvar = "Nope."; // Fel svar
    antalFel++;
    fel[multiplikator][multiplikand]=fel[multiplikator][multiplikand] + 1;
  }

  nyFraga();
  updateScore();
  document.getElementById("gissningText").focus();

}

function changeStatus(a,b,newStatus) {
  status[a][b]=newStatus;
  if (newStatus == 1 && multiplikator == a && multiplikand == b) {
    nyFraga();
  }

  updateStatus();
}

function statusEasy() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,1);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,0);
    }
  }
}
function statusLevel1() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,1);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,0);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 0; i<3;++i) {
      changeStatus(i,j,0);
    }
  }
  for (var j = 0; j<3;++j) {
    for (var i = 3; i<11;++i) {
      changeStatus(i,j,0);
    }
  }
  for (var j = 3; j<11;++j) {
      changeStatus(10,j,0);
      changeStatus(j,10,0);
  }
}
function statusMedium() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,0);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,1);
    }
  }

}
function statusMediumOnly() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,0);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,1);
    }
  }
  for (var j = 0; j<6;++j) {
    for (var i = 0; i<6;++i) {
      changeStatus(i,j,1);
    }
  }
}
function statusHard() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,0);
    }
  }
}
function statusHardOnly() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,1);
    }
  }
  for (var j = 6; j<11;++j) {
    for (var i = 6; i<11;++i) {
      changeStatus(i,j,0);
    }
  }
}
function statusSvaraHornet() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      changeStatus(i,j,1);
    }
  }
  for (var j = 6; j<10;++j) {
    for (var i = 6; i<10;++i) {
      changeStatus(i,j,0);
    }
  }
}
function statusRemoveGreen() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      if (fel[j][i] == 0 && ratt[j][i]>0) {
        changeStatus(j,i,1) ;
      }
    }
  }
}
function toggleStatus(a,b) {
  status[a][b]=status[a][b]+1;
  if (status[a][b] > 1) {
    status[a][b] = 0;
  }
  if (status[a][b] == 1 && multiplikator == a && multiplikand == b) {
    nyFraga();
  }
  updateStatus();
}
function toggleStatusRow(a) {
  for (var i = 0; i<11;++i) {
    toggleStatus(a,i);
  }
}
function toggleStatusColumn(b) {
  for (var i = 0; i<11;++i) {
    toggleStatus(i,b);
  }
}
function toggleStatusAll() {
  for (var j = 0; j<11;++j) {
    for (var i = 0; i<11;++i) {
      toggleStatus(i,j);
    }
  }
}

function getStatus(a,b) {
  return status[a][b];
}

function updateStatus() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      if (getStatus(j,i) == 0) {
        document.getElementById("d"+j+"x"+i).style.backgroundColor = "white";
      } else {
        document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgrey";
      }
    }
  }

}

function updateScore() {
  for (var j = 0; j < 11; j++) {
    for (var i = 0; i < 11; i++) {
      if (ratt[j][i] + fel[j][i] == 0) {
        document.getElementById("d"+j+"x"+i).innerHTML = "";
      } else {
        document.getElementById("d"+j+"x"+i).innerHTML = ratt[j][i] + " av " + (ratt[j][i] + fel[j][i]);
        if (fel[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "lightgreen";
        } else if (ratt[j][i] == 0) {
          document.getElementById("d"+j+"x"+i).style.backgroundColor = "red";
        }
      }
    }
  }
}
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
  updateStatus();
}
