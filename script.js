const player1 = "X";
const player2 = "O";
let currentPlayer = player1;
const turn = document.getElementsByClassName("turn");
turn[0].innerHTML = "Your turn"; //first player

id = null;
filled = [];

//turn taking
const playerTurn = () => {
  turn[0].innerHTML = currentPlayer === player1 ? "Your turn" : "";
  turn[1].innerHTML = currentPlayer === player2 ? "Your turn" : "";
};

//winning conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], //rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], //columns
  [0, 4, 8],
  [2, 4, 6], //diagonals
];

//clearing the board
function clearCells() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.innerHTML = ""; // Clear the content of each cell
  });
  filled = [];
  currentPlayer = player1;
}

//highlighting the winning cells
const highlightCells = (cell) => {
  const cellsToHighlight = [cell.a, cell.b, cell.c];

  cellsToHighlight.forEach((cell) => {
    cell.classList.replace("bg-slate-100", "bg-slate-900");
    cell.classList.replace("text-slate-900", "text-slate-100");
  });
};

//stop from clicking on cells after win
const stopClicking = () => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.removeEventListener("click", cellClicked);
  });
};

//checking for winner
const checkWinner = (filled) => {
  console.log(filled);
  let winner = null;
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (filled.length < 3) {
      break;
    }
    if ([a, b, c].every((val) => filled.includes(val))) {
      const cell = {
        a: document.getElementById(a),
        b: document.getElementById(b),
        c: document.getElementById(c),
      };
      if (
        cell.a.innerHTML == cell.b.innerHTML &&
        cell.b.innerHTML == cell.c.innerHTML
      ) {
        highlightCells(cell);
        stopClicking();
        const alert = document.getElementById("alert");
        alert.classList.replace("hidden", "visible");
        const alertText = document.getElementById("alert-text");
        alertText.innerHTML = `Player ${cell.a.innerHTML} won!`;
        // setTimeout(() => {
        //   alert.classList.replace("visible", "hidden");
        //   alertText.innerHTML = "";
        // }, 2000);
      }
    }
    if (filled.length == 9) {
      const alert = document.getElementById("alert");
      alert.classList.replace("hidden", "visible");
      const alertText = document.getElementById("alert-text");
      alertText.innerHTML = "It's a tie!";
      setTimeout(() => {
        alert.classList.replace("visible", "hidden");
        alertText.innerHTML = "";
        reload();
      }, 1000);
      //clearCells();
    }
  }
};

//reload
const reload = () => {
  location.reload();
};

//reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", reload);


//filling the board
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => cell.addEventListener("click", cellClicked));

function cellClicked(e) {
  id = e.target.id;
  if (!filled.includes(parseInt(id))) {
    filled.push(parseInt(id));
  }
  const cell = document.getElementById(id);
  if (cell.innerHTML == "") {
    cell.innerHTML = currentPlayer;
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    playerTurn();
  } else {
    const alert = document.getElementById("alert");
    alert.classList.replace("hidden", "visible");
    const alertText = document.getElementById("alert-text");
    alertText.innerHTML = "This cell is already filled!";
    setTimeout(() => {
      alert.classList.replace("visible", "hidden");
      alertText.innerHTML = "";
    }, 1000);
  }
  checkWinner(filled);
  playerTurn();
}
