"use strict";

let antalRatt = 0;
let ratt = matrix(11,11,0);
let fel = matrix(11,11,0);
let status = matrix(11,11,0);
let msgSvar = ``;

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

function changeStatus(a,b,newStatus) {
  status[a][b]=newStatus;
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

function question() {
  let a = 0;
  let b = 0;

  while (true) {
    a = Math.floor((Math.random() * 11));
    b = Math.floor((Math.random() * 11));
    if (getStatus(a, b) == 0) { break; }
  }

  let svar = prompt(`${msgSvar} ${a} * ${b}`, '');
  if (svar === null) {
      return 'bryt'; //break out of the function early
  }
  else if (svar == a * b) {
    msgSvar = 'Korrekt! '; // Rätt svar
    antalRatt++;
    ratt[a][b]=ratt[a][b] + 1;
  } else {
    msgSvar = "Fel. "; // Fel svar
    fel[a][b]=fel[a][b] + 1;
  }
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
  updateScore();
}
function gissa(antal) {
  msgSvar = "";
  for (var i = 0; i < antal; i++) {
      if (question() == 'bryt') {break;}
  }
  updateScore();
}
