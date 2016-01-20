var players = ['Red', 'Blue'];
var rows = 6;
var columns = 7;
var whoseTurn = 0;
var board = [];
var isInProgress = false;

window.onload = initialize();

/**
 * Just draw the board on page load.
 */
function initialize() {
    drawBoard();
}

/**
 * Create new game.
 */
function newGame() {
    whoseTurn = 0;
    board = [];
    drawBoard();
    showWhoseTurn();
    setMessage('Game started. Player 1 is red and Player 2 is blue. Red\'s turn.')
    isInProgress = true;
}

/**
 * Draw the board.
 */
function drawBoard() {
    var row, cell;
    var table = document.getElementById('board');

    // Make sure table is clean.
    table.innerHTML = '';

    for (var rowIndex = 0; rowIndex < rows; rowIndex++) {

        // Create the rows.
        row = table.insertRow(rowIndex);
       
        // Create the slots.
        for (var colIndex = 0; colIndex < columns; colIndex++) {

            cell = row.insertCell(colIndex);
            cell.setAttribute('id', colIndex + '-' + rowIndex);

            // Events.
            cell.onmouseenter = function () {
                showLegalMove(this.id, true);
            }

            cell.onmouseleave = function () {
                showLegalMove(this.id, false);
            }

            cell.onclick = function () {
                move(this.id);
            }

            // Create board array.
            board[colIndex] = [];
            board[colIndex][rowIndex] = "";

            // Draw a blank slot.
            var slot = document.createElement('div');
            slot.setAttribute('class', 'circle');
            cell.appendChild(slot);
        }
    }
}

/**
 * Get the row in a column with blank slot to get the legal move.
 */
function getLegalMove(x) {
    for (var y = rows - 1; y >= 0; y--) {
        if (!board[x][y] ) { return y; }
    }

    // Column is full so no legal move.
    return -1;
}

/**
 * Show legal moves on mouse hover.
 */
function showLegalMove(id, isOver) {
    if (!isInProgress) return false;

    var x = id.split('-').shift();
    var y = getLegalMove(x);

    if (y >= 0) {
        var classList = document.getElementById(x + '-' + y).classList;

        if (isOver) {
            classList.add('over');
        } else {
            classList.remove('over');
        }
    }
}

/**
 * Display the color of current player.
 */
function showWhoseTurn() {
    document.getElementById('turn').className = players[whoseTurn].toLowerCase();
    setMessage(players[whoseTurn] + '\'s turn.');
}

/**
 * Player has moved.
 */
function move(id) {
    if (!isInProgress) return false;

    var x = id.split('-').shift();
    var y = getLegalMove(x);

    // Update the drawing of the board.
    updateBoard(x, y);

    // Check if there are no legal moves.
    if (isTie()) {
        isInProgress = false;
        setMessage('No legal moves left. It\'s a tie!');
        return;
    }

    // Check if the column is already full.
    if (y < 0) {
        setMessage('No legal move for the selected column.');
        return;
    }

    // Check if won.
    if (isWinner(x, y)) {
        isInProgress = false;
        setMessage('<strong>' + players[whoseTurn] + ' won!</strong>');
    }

    // Switch player if there's no winner yet.
    else {
        whoseTurn = 1 - whoseTurn;
        showWhoseTurn();
        showLegalMove(id, true);
    }

}

/**
 * Check if there is no more space in board.
 */
function isTie() {
    for (var x = 0; x < columns; x++) {
        for (var y = 0; y < rows; y++) {
            if (board[x][y] == '' || typeof board[x][y] == 'undefined') {
                return false;
            }
        }
    }
    return true;
}

/**
 * Update the board.
 */
function updateBoard(x, y) {
    var player = players[whoseTurn];
    var cell = document.getElementById(x + '-' + y);
    board[x][y] = player;

    if (cell) {
        cell.firstChild.classList.add(player.toLowerCase());
    }
}

/**
 * Display message.
 */
function setMessage(msg) {
    document.getElementById('message').innerHTML = msg;
}

/**
 * Check if the last move wins.
 */
function isWinner(x, y) {
    var consecutives = 4;
    var count = 0;
    var z = 0;
    var i;

    // Horizontal.
    for (i = 0; i < columns; i++) {
        if (board[i][y] == players[whoseTurn]) {
            count++;
            if (count >= consecutives) { return true; }
        } else {
            count = 0;
        }
    }

    // Vertical.
    count = 0;
    for (i = 0; i < rows; i++) {
        if (board[x][i] == players[whoseTurn]) {
            count++;
            if (count >= consecutives) { return true; }
        } else {
            count = 0;
        }
    }

    // Top right to bottom left diagonal.
    var dim = columns + rows;
	for( var k = 0 ; k < dim; k++, count = 0) {
        for( var j = 0 ; j <= k ; j++ ) {
            var i = k - j;
            if( i < columns && j < rows && board[i][j] == players[whoseTurn]) {
            	count++;
                if (count >= consecutives) { return true; }
            }

        }
    }

    // Top left to bottom right diagonal.
	for( var k = 0 ; k < dim; k++, count = 0) {
		var kk = (columns - 1) - k;
        for( var j = 0 ; j <= k ; j++ ) {
            var i = kk + j;
            if( i >= 0 && j < rows && board[i][j] == players[whoseTurn]) {
            	count++;
                if (count >= consecutives) { return true; }
            }

        }
    }

    return false;
}