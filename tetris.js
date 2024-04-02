document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('scoreValue');

    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;
    const BOARD_COLOR = '#f0f0f0';

    const board = [];
    let score = 0;
    let currentPiece;
    let intervalId;
    let gameOver = false;

    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = BOARD_COLOR;
        }
    }

    function drawBoard() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                drawBlock(c, r, board[r][c]);
            }
        }
    }

    function drawBlock(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function clearBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clearBoard();
        drawBoard();
        if (currentPiece) {
            currentPiece.draw();
        }
    }

    class Piece {
        constructor(shape, color) {
            this.shape = shape;
            this.color = color;
            this.x = 3;
            this.y = -2;
        }

        draw() {
            this.shape.forEach((row, y) => {
                row.forEach((block, x) => {
                    if (block) {
                        drawBlock(this.x + x, this.y + y, this.color);
                    }
                });
            });
        }

        moveDown() {
            this.y++;
        }

        moveLeft() {
            this.x--;
        }

        moveRight() {
            this.x++;
        }

        rotate() {
            const newShape = [];
            const N = this.shape.length;
            for (let i = 0; i < N; i++) {
                newShape[i] = new Array(N).fill(0);
            }
            for (let y = 0; y < N; y++) {
                for (let x = 0; x < N; x++) {
                    newShape[x][N - 1 - y] = this.shape[y][x];
                }
            }
            this.shape = newShape;
        }
        

        canMoveDown() {
            return this.y + this.shape.length < ROWS && !this.collides(0, 1);
        }

        canMoveLeft() {
            return this.x > 0 && !this.collides(-1, 0);
        }

        canMoveRight() {
            return this.x + this.shape[0].length < COLS && !this.collides(1, 0);
        }

        collides(dx, dy) {
            return this.shape.some((row, y) => {
                return row.some((block, x) => {
                    const newX = this.x + x + dx;
                    const newY = this.y + y + dy;
                    return block && (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== BOARD_COLOR));
                });
            });
        }

        merge() {
            this.shape.forEach((row, y) => {
                row.forEach((block, x) => {
                    if (block) {
                        board[this.y + y][this.x + x] = this.color;
                    }
                });
            });
        }
    }

    function randomPiece() {
        const shapes = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[1, 0, 0], [1, 1, 1]],
            [[0, 0, 1], [1, 1, 1]],
            [[0, 1, 1], [1, 1, 0]],
            [[1, 1, 0], [0, 1, 1]],
            [[1, 0], [1, 1], [0, 1]]
        ];
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500'];

        const shapeIndex = Math.floor(Math.random() * shapes.length);
        const colorIndex = Math.floor(Math.random() * colors.length);

        return new Piece(shapes[shapeIndex], colors[colorIndex]);
    }

    function dropPiece() {
        if (currentPiece.canMoveDown()) {
            currentPiece.moveDown();
            draw();
        } else {
            currentPiece.merge();
            checkRows();
            currentPiece = randomPiece();
            if (currentPiece.collides(0, 0)) {
                gameOver = true;
                clearInterval(intervalId);
                alert("Game Over! Your Score: " + score);
            }
        }
    }

    function checkRows() {
        let rowCleared = false;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every(block => block !== BOARD_COLOR)) {
                board.splice(r, 1);
                board.unshift(Array(COLS).fill(BOARD_COLOR));
                score += 100;
                updateScore();
                rowCleared = true;
            }
        }
        if (rowCleared) {
            draw();
        }
    }

    document.addEventListener('keydown', (event) => {
        if (!gameOver) {
            switch (event.key) {
                case 'ArrowLeft':
                    if (currentPiece.canMoveLeft()) {
                        currentPiece.moveLeft();
                        draw();
                    }
                    break;
                case 'ArrowRight':
                    if (currentPiece.canMoveRight()) {
                        currentPiece.moveRight();
                        draw();
                    }
                    break;
                case 'ArrowDown':
                    dropPiece();
                    break;
                case 'ArrowUp':
                    currentPiece.rotate();
                    if (!currentPiece.collides(0, 0)) {
                        draw();
                    } else {
                        currentPiece.rotate(); // revert rotation if it causes collision
                    }
                    break;
            }
        }
    });

    currentPiece = randomPiece();
    intervalId = setInterval(dropPiece, 1000);

    draw();
});
