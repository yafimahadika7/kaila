const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const rows = 20;
const cols = 10;
const blockSize = 30;
let score = 0;
let board = Array.from({ length: rows }, () => Array(cols).fill(0));

const colors = [
    'red', 'blue', 'green', 'yellow', 'cyan', 'purple', 'orange'
];

const tetrominoes = [
    [[1, 1, 1, 1]], // I shape
    [[1, 1, 0], [0, 1, 1]], // Z shape
    [[0, 1, 1], [1, 1, 0]], // S shape
    [[1, 1], [1, 1]], // O shape
    [[1, 0, 0], [1, 1, 1]], // L shape
    [[0, 0, 1], [1, 1, 1]], // J shape
    [[0, 1, 0], [1, 1, 1]]  // T shape
];

let currentPiece = {
    shape: null,
    color: '',
    row: 0,
    col: 0
};

function startGame() {
    spawnPiece();
    updateBoard();
    setInterval(gameLoop, 500);
}

function spawnPiece() {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    currentPiece.shape = tetrominoes[randomIndex];
    currentPiece.color = colors[randomIndex];
    currentPiece.row = 0;
    currentPiece.col = Math.floor(cols / 2) - Math.floor(currentPiece.shape[0].length / 2);
}

function gameLoop() {
    if (checkCollision(currentPiece.row + 1, currentPiece.col)) {
        placePiece();
        spawnPiece();
    } else {
        currentPiece.row++;
    }
    updateBoard();
}

function updateBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] !== 0) {
                ctx.fillStyle = board[r][c];
                ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
            }
        }
    }
    drawPiece(currentPiece);
    document.getElementById('score-value').textContent = score;
}

function drawPiece(piece) {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                ctx.fillStyle = piece.color;
                ctx.fillRect((piece.col + c) * blockSize, (piece.row + r) * blockSize, blockSize, blockSize);
            }
        }
    }
}

function placePiece() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                board[currentPiece.row + r][currentPiece.col + c] = currentPiece.color;
            }
        }
    }
    clearFullRows();
}

function checkCollision(row, col) {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                if (row + r >= rows || col + c < 0 || col + c >= cols || board[row + r][col + c] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function clearFullRows() {
    for (let r = 0; r < rows; r++) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(Array(cols).fill(0));
            score += 10;
        }
    }
}

startGame();

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft') {
        movePiece(-1, 0);
    } else if (event.key === 'ArrowRight') {
        movePiece(1, 0);
    } else if (event.key === 'ArrowDown') {
        movePiece(0, 1);
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    }
}

function movePiece(deltaX, deltaY) {
    if (!checkCollision(currentPiece.row + deltaY, currentPiece.col + deltaX)) {
        currentPiece.row += deltaY;
        currentPiece.col += deltaX;
        updateBoard();
    }
}

function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index])
    ).reverse();

    const originalShape = currentPiece.shape;
    currentPiece.shape = rotatedShape;

    if (checkCollision(currentPiece.row, currentPiece.col)) {
        currentPiece.shape = originalShape;
    } else {
        updateBoard();
    }
}