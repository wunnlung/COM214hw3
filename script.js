document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('game-board');
    let squares = Array.from(Array(20), () => Array(10).fill(0));
    let currentPosition = { x: 4, y: 0 };
    let currentRotation = 0;
    let currentPiece = randomPiece();
  
    function randomPiece() {
      const pieces = 'ILJOTSZ';
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
      return getPiece(randomPiece);
    }
  
    function getPiece(piece) {
      switch (piece) {
        case 'I':
          return [[1], [1], [1], [1]];
        case 'L':
          return [[1, 0], [1, 0], [1, 1]];
        case 'J':
          return [[0, 1], [0, 1], [1, 1]];
        case 'O':
          return [[1, 1], [1, 1]];
        case 'T':
          return [[1, 1, 1], [0, 1, 0]];
        case 'S':
          return [[0, 1, 1], [1, 1, 0]];
        case 'Z':
          return [[1, 1, 0], [0, 1, 1]];
      }
    }
  
    function draw() {
      grid.innerHTML = '';
      for (let y = 0; y < squares.length; y++) {
        for (let x = 0; x < squares[y].length; x++) {
          const square = document.createElement('div');
          square.className = squares[y][x] ? 'block' : '';
          square.style.top = `${y * 30}px`;
          square.style.left = `${x * 30}px`;
          grid.appendChild(square);
        }
      }
    }
  
    function collision(x, y, piece) {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col] && (squares[y + row] && squares[y + row][x + col]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }
  
    function merge() {
      currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            squares[y + currentPosition.y][x + currentPosition.x] = value;
          }
        });
      });
    }
  
    function moveDown() {
      if (!collision(currentPosition.x, currentPosition.y + 1, currentPiece)) {
        currentPosition.y++;
      } else {
        merge();
        currentPosition.y = 0;
        currentPiece = randomPiece();
      }
    }
  
    function rotate() {
      const nextRotation = currentPiece.map((_, index) =>
        currentPiece.map(row => row[index]).reverse()
      );
      if (!collision(currentPosition.x, currentPosition.y, nextRotation)) {
        currentPiece = nextRotation;
      }
    }
  
    function moveLeft() {
      if (!collision(currentPosition.x - 1, currentPosition.y, currentPiece)) {
        currentPosition.x--;
      }
    }
  
    function moveRight() {
      if (!collision(currentPosition.x + 1, currentPosition.y, currentPiece)) {
        currentPosition.x++;
      }
    }
  
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          rotate();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
      }
      draw();
    });
  
    function update() {
      moveDown();
      draw();
      requestAnimationFrame(update);
    }
  
    update();
  });
  