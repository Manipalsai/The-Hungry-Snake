let inputDir = { x: 0, y: 0 };
const FoodSound = new Audio('foodSound.mp3');
const gameOverSound = new Audio('gameOver.mp3');
const moveSound = new Audio('moves.mp3');
const songSound = new Audio('song.mp3');

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArray = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// DOM references
let board = document.getElementById("board");
let scoreBox = document.getElementById("scoreBox");
let hiScoreBox = document.getElementById("hiScoreBox");

// Game loop
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

// Collision check
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  if (
    snake[0].x >= 18 || snake[0].x <= 0 ||
    snake[0].y >= 18 || snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}

// Game logic
function gameEngine() {
  if (isCollide(snakeArray)) {
    gameOverSound.play();
    songSound.pause();
    inputDir = { x: 0, y: 0 };

    // Show Game Over Modal
    document.getElementById("finalScore").innerText = "Your Score: " + score;
    document.getElementById("gameOverModal").style.display = "flex";

    return;
  }

  if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
    FoodSound.play();
    score += 1;
    scoreBox.innerHTML = "Score: " + score;

    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem("hiScore", JSON.stringify(hiScore));
      hiScoreBox.innerHTML = "High Score: " + hiScore;
    }

    snakeArray.unshift({
      x: snakeArray[0].x + inputDir.x,
      y: snakeArray[0].y + inputDir.y,
    });

    let a = 2, b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }

  snakeArray[0].x += inputDir.x;
  snakeArray[0].y += inputDir.y;

  board.innerHTML = "";
  snakeArray.forEach((e, index) => {
    let snakeEle = document.createElement("div");
    snakeEle.style.gridRowStart = e.y;
    snakeEle.style.gridColumnStart = e.x;
    snakeEle.classList.add(index === 0 ? "head" : "snake");
    board.appendChild(snakeEle);
  });

  let foodEle = document.createElement("div");
  foodEle.style.gridRowStart = food.y;
  foodEle.style.gridColumnStart = food.x;
  foodEle.classList.add("food");
  board.appendChild(foodEle);
}

// High Score init
let hiScore = localStorage.getItem("hiScore");
hiScore = hiScore === null ? 0 : JSON.parse(hiScore);
hiScoreBox.innerHTML = "High Score: " + hiScore;

// Keyboard control
window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 };
  moveSound.play();
  switch (e.key) {
    case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
    case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
    case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
    case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
  }
});

// Start game
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  window.requestAnimationFrame(main);
  songSound.play();
});

// Play Again button (modal)
const modal = document.getElementById("gameOverModal");
const playAgainBtn = document.getElementById("playAgainBtn");

playAgainBtn.addEventListener("click", () => {
  modal.style.display = "none";
  inputDir = { x: 0, y: 0 };
  snakeArray = [{ x: 13, y: 15 }];
  score = 0;
  scoreBox.innerHTML = "Score: 0";
  songSound.play();
  window.requestAnimationFrame(main);
});
