// 6 * 7 = 42 slots on the board
const ROWS = 6;
const COLS = 7;

// Get reference to game board container
const gameBoard = document.getElementById("game-board");

// Get reference to game shell container
const gameShell = document.getElementById("game-shell");

// Get reference to start menu and start game button (for future use with multiplatyer)
const startMenu = document.getElementById("start-menu");
const startGameBtn = document.getElementById("start-button");
startGameBtn.addEventListener("click", startGame);

// Get reference to new game button
const newGameBtn = document.getElementById("new-game");
newGameBtn.addEventListener("click", newGame); // Add click event listener to new game button

// Create array tp represent game board
let board = [];

// Game variables
let player = 1; // Player 1 starts (red)
let winner = false;

function startGame() { // Function to start game when start button is clicked
    startMenu.style.display = "none"; // Hide start menu
    gameShell.classList.remove("hidden");
    newGame(); // Start new game
}

// Function to create game board array and populate with 0s
// Empty slot = 0, Red slot (player 1) = 1, Blue slot (player 2) = 2
function createBoard() {
// Nested loop to populate initial game board
    for(let row_index = 0; row_index < ROWS; row_index++) { // Loop through each row
        let row= [];
        for(let col_index = 0; col_index < COLS; col_index++) { // Loop through each column and add 0 to represent empty slot
            row.push(0);
        }
        board.push(row); // Add row to board creating 2D array
    }
}

// Function to update player turn message in DOM
function turn(player, winner) { 
    const turnMessage = document.getElementById("player");
    if(winner === true && player === 1) { // If winner found, update message to indicate winner
        turnMessage.innerHTML = "Player 1 wins! (Red)";
    } 
    else if(player === 2 && winner == true) { // If winner found, update message to indicate winner
        turnMessage.innerHTML = "Player 2 wins! (Blue)";
    }
    else if(player === 1 && !winner) { // If player 1's turn, update message to indicate player 1's turn
        turnMessage.innerHTML = "Player 1's turn (Red)";
    } 
    else if(player === 2 && !winner) { // If player 2's turn, update message to indicate player 2's turn
        turnMessage.innerHTML = "Player 2's turn (Blue)";
    }
}

// Function to reset game variables and create new board when new game button is clicked
function newGame() { 
    //gameBoard.innerHTML = ""; // Clear board
    board = []; // Reset game board array
    player = 1;
    winner = false;
    turn(player, winner);
    createBoard();
    createBoardDOM();
    updateBoard();
}

// Function to render game board in DOM
function createBoardDOM() {
  gameBoard.innerHTML = ""; // Clear board

  for (row_index = 0; row_index < ROWS; row_index++) { // Loop through each row
    for (let col_index = 0; col_index < COLS; col_index++) { // Loop through each column and create div for each slot
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.dataset.row = row_index;
      slot.dataset.col = col_index;
      slot.addEventListener("mouseover", (event) => { // Add mouseover event listener to each slot
            if(winner === true) { // If game already has a winner, ignore hover
                return;
            }
            const col_index = parseInt(event.currentTarget.dataset.col); // Get column index of hovered slot
            const row_index = checkEmptySlot(col_index); // Check for empty slot in column and get row index of empty slot
            if(row_index === -1) { // If no empty slot found, ignore hover
                return;
            }
            const previewSlot = document.querySelector(
                `.slot[data-row="${row_index}"][data-col="${col_index}"]`
            );

            if (player === 1) {
                previewSlot.classList.add("red-preview");
            } else {
                previewSlot.classList.add("blue-preview");
            }
      });
      slot.addEventListener("mouseout", () => { // Add mouseout event listener to each slot to remove hover effect when mouse leaves slot
            if(winner === true) { // If game already has a winner, ignore hover
                return;
            }
            deleteHover();
      });
      slot.addEventListener("click", handleSlotClick); // Add click event listener to each slot
      
      gameBoard.appendChild(slot);
    }
  }
}

// Function to remove hover effect from all slots
function deleteHover() {
    const previewSlots = document.querySelectorAll(".red-preview, .blue-preview");
    previewSlots.forEach(slot => {
        slot.classList.remove("red-preview", "blue-preview");
    });
}

// Function to update game board in DOM after each move
function updateBoard() {
    const slots = document.querySelectorAll(".slot"); // Get all slot elements in DOM
    slots.forEach(slot => { // Loop through each slot and update class based on game board array
        const row_index = parseInt(slot.dataset.row);
        const col_index = parseInt(slot.dataset.col);

        slot.innerHTML = ""; // Clear slot
        if (board[row_index][col_index] !== 0) { // If slot is not empty, create piece element and add class based on player
            const piece = document.createElement("div"); // Create piece element to represent player's move
            piece.classList.add("piece"); // Add piece 

            if (board[row_index][col_index] === 1) { // If player 1, add red class to piece
                piece.classList.add("red");
            } else if (board[row_index][col_index] === 2) { // If player 2, add blue class to piece
                piece.classList.add("blue");
            }

            slot.appendChild(piece); // Add piece to slot in DOM
        }
    });
}


// Function to handle click event on slot by player
function handleSlotClick(event) {
    //console.log("Slot clicked:", event.target.dataset.row, event.target.dataset.col);
    if(winner === true) { // If game already has a winner, ignore clicks
        return;
    }
    const col_index = parseInt(event.currentTarget.dataset.col); // Get column index of clicked slot
    const row_index = checkEmptySlot(col_index); // Check for empty slot in column and get row index of empty slot
    if(row_index === -1) { // If no empty slot found, ignore click
        return;
    }
    board[row_index][col_index] = player; // Update game board array with current player's move
    updateBoard(); // Update game board in DOM

    var winnerValue = checkWinner(); // Check for winner after move
    if(winnerValue !== 0) { // If winner found, update winner variable
        winner = true;
        turn(winnerValue, true);
        deleteHover();
        return;
    }
    if(checkTie()) { // Check for tie after move
        document.getElementById("player").innerHTML = "It's a tie!";
        winner = true;
        deleteHover();
        return; 
    }
    if (player === 1) { // Switch player for next turn
        player = 2;
    } else {
        player = 1;
    }
    turn(player, winner); // Update player turn message in DOM
}

// Function to check for empty slot in column and return row index of empty slot
function checkEmptySlot(col_index) {
    for(let row_index = ROWS - 1; row_index >= 0; row_index--) { // Start from bottom row and check upwards for empty slot
        if(board[row_index][col_index] === 0) { // If empty slot found
            return row_index; // Return row index of empty slot
        }
    }
    return -1; // No empty slot found
}

function checkTie() { // Function to check for tie (no empty slots left and winner is false)
    for(let row_index = 0; row_index < ROWS; row_index++) { // Loop through each row
        for(let col_index = 0; col_index < COLS; col_index++) { // Loop through each column
            if(board[row_index][col_index] === 0) { // If empty slot found, not a tie
                return false;
            }
        }
    }
    return true; // tie if no empty slots found
}

// Function to check for winner after each move
function checkWinner() {
  // horizontal
  for (let row = 0; row < ROWS; row++) { // Loop through each row
    for (let col = 0; col < COLS - 3; col++) { // Loop through each column up to the 3rd to last column (since we need 4 in a row to win)
      let value = board[row][col];

      if ( // Check if current slot is not empty and matches the next three slots horizontally
        value !== 0 &&
        value === board[row][col + 1] &&
        value === board[row][col + 2] &&
        value === board[row][col + 3]
      ) {
        return value;
      }
    }
  }

  // vertical
  for (let row = 0; row < ROWS - 3; row++) { // Loop through each row up to the 3rd to last row (since we need 4 in a row to win)
    for (let col = 0; col < COLS; col++) { // Loop through each column
      let value = board[row][col];

      if ( // Check if current slot is not empty and matches the next three slots vertically
        value !== 0 &&
        value === board[row + 1][col] &&
        value === board[row + 2][col] &&
        value === board[row + 3][col]
      ) {
        return value;
      }
    }
  }

  // diagonal down to thr right
  for (let row = 0; row < ROWS - 3; row++) { // Loop through each row up to the 3rd to last row (since we need 4 in a row to win)
    for (let col = 0; col < COLS - 3; col++) { // Loop through each column up to the 3rd to last column (since we need 4 in a row to win)
      let value = board[row][col];

      if ( // Check if current slot is not empty and matches the next three slots diagonally down-right
        value !== 0 &&
        value === board[row + 1][col + 1] &&
        value === board[row + 2][col + 2] &&
        value === board[row + 3][col + 3]
      ) {
        return value;
      }
    }
  }

  // diagonal up to the right
  for (let row = 3; row < ROWS; row++) { // Loop through each row starting from the 4th row (since we need 4 in a row to win)
    for (let col = 0; col < COLS - 3; col++) { // Loop through each column up to the 3rd to last column (since we need 4 in a row to win)
      let value = board[row][col];

      if ( // Check if current slot is not empty and matches the next three slots diagonally up-right
        value !== 0 &&
        value === board[row - 1][col + 1] &&
        value === board[row - 2][col + 2] &&
        value === board[row - 3][col + 3]
      ) {
        return value;
      }
    }
  }

  return 0;
}

//createBoard();
//createBoardDOM();
//updateBoard();