const player1 = "X";
const player2 = "O";
let currentPlayer = player1;
const turn = document.getElementsByClassName("turn");
turn[0].innerHTML = "Your turn"; //first player
score = 0;
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

//score of different rows
const rowScore = [];

//clearing the board
function clearCells() {
  //reset the board without reloading the page
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.replace("bg-slate-900", "bg-slate-100");
    cell.classList.replace("text-slate-100", "text-slate-900");
    cell.addEventListener("click", cellClicked);
    //empty the filled array
    filled = [];
    // reset to player 1
    currentPlayer = player1;
    playerTurn();
  });
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

//evaluate the board for the minimax algorithm
function evaluateBoard(winner) {
  // Check if the AI has won
  if (winner === player2) {
    score = 10;
    return score;
  }
  // Check if the player has won
  if (winner === player1) {
    score = -10;
    return score;
  }
  // It's a draw
  return 0;
}

//checking for winner
const checkWinner = (filled) => {
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
        winner = cell.a.innerHTML;
        score = evaluateBoard(winner);
        const alert = document.getElementById("alert");
        alert.classList.replace("hidden", "visible");
        const alertText = document.getElementById("alert-text");
        alertText.innerHTML = `Player ${cell.a.innerHTML} won!`;
        setTimeout(() => {
          alert.classList.replace("visible", "hidden");
          alertText.innerHTML = "";
          clearCells();
        }, 1000);
      }
    }
    if (filled.length == 9 && winner == null) {
      const alert = document.getElementById("alert");
      alert.classList.replace("hidden", "visible");
      const alertText = document.getElementById("alert-text");
      alertText.innerHTML = "It's a tie!";
      setTimeout(() => {
        alert.classList.replace("visible", "hidden");
        alertText.innerHTML = "";
        clearCells();
      }, 1000);
    }
  }
};

//reset button
const resetButton = document.getElementById("reset");
resetButton.addEventListener("click", clearCells);

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

//player 2
//best move
function bestMoveRow() {
  let bestScore = -Infinity;
  let worstScore = Infinity;
  let bestMoveIndex = -1;
  let worstMoveIndex = -1;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    const cell = {
      a: document.getElementById(a),
      b: document.getElementById(b),
      c: document.getElementById(c),
    };
    const cellsToCheck = [cell.a, cell.b, cell.c];
    const rowScore = [];

    cellsToCheck.forEach((cellToCheck) => {
      if (cellToCheck.innerHTML == player1) {
        rowScore.push(-1);
      } else if (cellToCheck.innerHTML == player2) {
        rowScore.push(1);
      }
    });

    // Calculate the sum of rowScore
    const sum = rowScore.reduce((acc, curr) => acc + curr, 0);

    if (sum > bestScore) {
      bestScore = sum;
      bestMoveIndex = i;
    }

    if (sum < worstScore) {
      worstScore = sum;
      worstMoveIndex = i;
    }
  }

  // Return both bestScore and worstScore in an object
  return { bestScore, worstScore };
}

//player 2 filling the board
function player2Move() {
  const { bestScore, worstScore } = bestMoveRow();  //if two cells are filled, fill the third
  if (
    (cell.a.innerHTML == player2 &&
      cell.b.innerHTML == player2 &&
      cell.c.innerHTML == " ") ||
    (cell.a.innerHTML == player2 &&
      cell.c.innerHTML == player2 &&
      cell.b.innerHTML == " ") ||
    (cell.b.innerHTML == player2 &&
      cell.c.innerHTML == player2 &&
      cell.a.innerHTML == " ")
  ) {
    const [a, b, c] = winningConditions[bestMoveIndex];
    const cell = {
      a: document.getElementById(a),
      b: document.getElementById(b),
      c: document.getElementById(c),
    };
    if (cell.a.innerHTML == " ") {
      cell.a.innerHTML = player2;
      filled.push(cell.a.id);
    } else if (cell.b.innerHTML == " ") {
      cell.b.innerHTML = player2;
      filled.push(cell.b.id);
    } else if (cell.c.innerHTML == " ") {
      cell.c.innerHTML = player2;
      filled.push(cell.c.id);
    }
  } else{
    const [a, b, c] = winningConditions[worstMoveIndex];
    const cell = {
      a: document.getElementById(a),
      b: document.getElementById(b),
      c: document.getElementById(c),
    };
    if (cell.a.innerHTML == " ") {
      cell.a.innerHTML = player2;
      filled.push(cell.a.id);
    } else if (cell.b.innerHTML == " ") {
      cell.b.innerHTML = player2;
      filled.push(cell.b.id);
    } else if (cell.c.innerHTML == " ") {
      cell.c.innerHTML = player2;
      filled.push(cell.c.id);
    }
  }

  checkWinner(filled);
  playerTurn();
}

// function minimax(depth, isMaximizing) {
//   if (score === 10 || score === -10 || filled.length == 9 ) {
//     return score;
//   }

//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 1; i < filled.length; i++) {
//       if (currentPlayer === player1) {
//         currentPlayer = player2;
//         //filled[i] = player2;
//         bestScore = Math.max(bestScore, minimax(filled, depth + 1, false));
//         filled[i] = "";
//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < board.length; i++) {
//       if (board[i] === "") {
//         board[i] = player1;
//         bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
//         board[i] = "";
//       }
//     }
//     return bestScore;
//   }
// }

//score the board
// function scoreBoard() {
//   for (let i = 0; i < filled.length; i++) {
//     if (filled[i] === player1) {
//       score -= 1;
//     } else if (filled[i] === player2) {
//       score += 1;
//     }
//   }
//   return score;
// }
