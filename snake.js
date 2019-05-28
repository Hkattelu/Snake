const gridSize = 25;

const initialX = 12;
const initialY = 12;
const initialDirection = 'r';
const initialLength = 4;
const snakeColor = 'red';
const blockSize = 20;

let canvas;
let grid;
let snakeHead;
let snakeTail;

let gameLoop;

function initSnake(size, before) {
  if (size === 0) {
    return undefined;
  }

  const snakePiece = {
    x: initialX + size,
    y: initialY,
    facing: initialDirection,
  }
  snakePiece.before = before;
  snakePiece.after = initSnake(size - 1, snakePiece);
  
  if (size === 1) {
    snakeTail = snakePiece;
  }
  return snakePiece;
}

function init() {
  grid = new Array(gridSize).fill(0)
            .map(() => new Array(gridSize).fill(''));
  snakeHead = initSnake(initialLength);
  canvas = document.getElementById('canvas')
                    .getContext('2d');
  canvas.fillStyle = snakeColor;
}

function update() {
  snakeTail = snakeTail.before;
  snakeTail.after = undefined;

  let newX = snakeHead.x;
  let newY = snakeHead.y; 
  switch(snakeHead.facing) {
    case 'l':
      newX--;
      break;
    case 'r':
      newX++;
      break;
    case 'u':
      newY--;
      break;
    case 'd':
      newY++;
      break;
    default:
  }

  if (newX < 0 || newX > gridSize
     || newY < 0 || newY > gridSize) {
    gameOver();
    return false;
  }

  snakeHead.before = {
    x: newX,
    y: newY,
    facing: snakeHead.facing,
    before: undefined,
    after: snakeHead,
  }
  snakeHead = snakeHead.before;
  return true;
}

function draw() {
  canvas.clearRect(0, 0, gridSize*blockSize, gridSize*blockSize);
  const b = blockSize;
  let snakePiece = snakeHead;
  while (!!snakePiece) {
     canvas.fillRect(
         snakePiece.x * b + 1, snakePiece.y * b + 1,
         b - 1, b - 1);
     snakePiece = snakePiece.after;
  }
}

function loop() {
  if (update()) {
    draw();
  }
}

function gameOver() {
  clearInterval(gameLoop);
  document.getElementById('message').innerText = 'Game Over';
}

function main() {
  init();
  draw();
  gameLoop = setInterval(loop, 400);
}

function inputHandler(e) {
  const prevFacing = snakeHead.after.facing;
  switch (e.keyCode) {
    case 37:
      if (prevFacing !== 'r') snakeHead.facing = 'l';
      break;
    case 39:
      if (prevFacing !== 'l') snakeHead.facing = 'r';
      break;
    case 38:
      if (prevFacing !== 'd') snakeHead.facing = 'u';
      break;
    case 40:
      if (prevFacing !== 'u') snakeHead.facing = 'd';
      break;
    default:
  }
}

document.addEventListener('keydown', inputHandler);
main();
