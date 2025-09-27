const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let birdX = 100;
let birdY = 200;
let birdRadius = 20;
let gravity = 0.5;
let lift = -10;
let velocity = 0;

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", flap);
document.addEventListener("mousedown", flap); // mouse click also works

function flap() {
  if (!gameOver) {
    velocity = lift;
  } else {
    // Restart game
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    frame = 0;
  }
}

function drawBird() {
  ctx.beginPath();
  ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  }
}

function updatePipes() {
  if (frame % 100 === 0) {
    let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
    let gap = 200;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: pipeHeight,
      bottom: canvas.height - (pipeHeight + gap),
    });
  }

  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    pipe.x -= 4;

    // Collision detection
    if (
      birdX + birdRadius > pipe.x &&
      birdX - birdRadius < pipe.x + pipe.width &&
      (birdY - birdRadius < pipe.top ||
        birdY + birdRadius > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }

    // Increase score
    if (pipe.x + pipe.width === birdX) {
      score++;
    }
  }

  // Remove pipes off screen
  if (pipes.length > 0 && pipes[0].x < -pipes[0].width) {
    pipes.shift();
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "60px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 180, canvas.height / 2);
  ctx.font = "30px Arial";
  ctx.fillText(
    "Press any key or click to restart",
    canvas.width / 2 - 200,
    canvas.height / 2 + 50
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    velocity += gravity;
    birdY += velocity;

    if (birdY + birdRadius > canvas.height) {
      gameOver = true;
    }

    drawBird();
    updatePipes();
    drawPipes();
    drawScore();
    frame++;
  } else {
    drawGameOver();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
