// Game variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let scoreElement = document.getElementById("score");
let highScoreElement = document.getElementById("highScore");
let livesElement = document.getElementById("lives");

// Game state
let score = 0;
let lives = 3;
let highScore = 0;
let gameOver = false;
let gamePaused = false;
let gameStarted = false;

// Load high score from storage
chrome.storage.local.get(['highScore'], function(result) {
  if (result.highScore) {
    highScore = result.highScore;
    highScoreElement.textContent = highScore;
  }
});

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball properties
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2.4; // Increased by 20%
let ballDY = -2.4; // Increased by 20%

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 47;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 30;
const brickOffsetLeft = 10;

// Create bricks
let bricks = [];
function createBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      // Different colors for different rows
      let color;
      switch(r) {
        case 0: color = "#FF0000"; break; // Red
        case 1: color = "#FF7F00"; break; // Orange
        case 2: color = "#FFFF00"; break; // Yellow
        case 3: color = "#00FF00"; break; // Green
        case 4: color = "#0000FF"; break; // Blue
        default: color = "#FFFFFF"; // White
      }
      
      bricks[c][r] = { 
        x: 0, 
        y: 0, 
        status: 1, 
        color: color,
        points: (brickRowCount - r) * 10 // Higher rows worth more points
      };
    }
  }
}

// Controls
let rightPressed = false;
let leftPressed = false;

// Event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("click", startGame, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "p" || e.key === "P") {
    togglePause();
  } else if (e.key === " " && !gameStarted) {
    startGame();
  } else if ((e.key === "r" || e.key === "R") && gameOver) {
    // Create a mock event object with client coordinates in the middle of the button
    const mockEvent = {
      clientX: canvas.offsetLeft + canvas.width / 2,
      clientY: canvas.offsetTop + canvas.height / 2 + 70 // Approximate button center
    };
    resetGame(mockEvent);
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    
    // Keep paddle within canvas boundaries
    if (paddleX < 0) {
      paddleX = 0;
    } else if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function togglePause() {
  gamePaused = !gamePaused;
  if (!gamePaused) {
    draw();
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    canvas.removeEventListener("click", startGame);
    draw();
  }
}

// Draw functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawStartScreen() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);
  ctx.font = "16px Arial";
  ctx.fillText("Use arrow keys or mouse to move the paddle", canvas.width / 2, canvas.height / 2 + 30);
  ctx.fillText("Press 'P' to pause, 'R' to restart", canvas.width / 2, canvas.height / 2 + 55);
}

function drawGameOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "16px Arial";
  ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 30);
  // Add instruction to press R to restart
  ctx.fillStyle = "#FF9900"; // Orange color to make it stand out
  ctx.fillText("GAME OVER, click R to restart!", canvas.width / 2, canvas.height / 2 + 85);
  ctx.fillStyle = "#FFFFFF"; // Reset to white for other elements
  
  // Draw restart button
  const buttonWidth = 120;
  const buttonHeight = 40;
  const buttonX = (canvas.width - buttonWidth) / 2;
  const buttonY = canvas.height / 2 + 50;
  
  // Button background
  ctx.beginPath();
  ctx.rect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  
  // Button text
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("RESTART", canvas.width / 2, buttonY + 25);
  
  // Store button coordinates for click detection
  window.restartButton = {
    x: buttonX,
    y: buttonY,
    width: buttonWidth,
    height: buttonHeight
  };
}

function drawPauseScreen() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  ctx.font = "16px Arial";
  ctx.fillText("Press 'P' to resume", canvas.width / 2, canvas.height / 2 + 30);
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballDY = -ballDY;
          brick.status = 0;
          score += brick.points;
          scoreElement.textContent = score;
          
          // Check if all bricks are destroyed
          if (checkLevelComplete()) {
            createBricks();
            // Increase ball speed for next level
            if (ballDX > 0) ballDX += 0.5;
            else ballDX -= 0.5;
            if (ballDY > 0) ballDY += 0.5;
            else ballDY -= 0.5;
          }
          
          // Update high score if needed
          if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            chrome.storage.local.set({highScore: highScore});
          }
        }
      }
    }
  }
}

function checkLevelComplete() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        return false;
      }
    }
  }
  return true;
}

// Reset game
function resetGame(e) {
  // Only reset if game is over
  if (!gameOver) return;
  
  // Check if click is within restart button (if it exists)
  if (window.restartButton) {
    const relativeX = e.clientX - canvas.offsetLeft;
    const relativeY = e.clientY - canvas.offsetTop;
    const button = window.restartButton;
    
    // If click is outside the button, do nothing
    if (relativeX < button.x || relativeX > button.x + button.width ||
        relativeY < button.y || relativeY > button.y + button.height) {
      return;
    }
  }
  
  // Remove the reset event listener to prevent duplicates
  canvas.removeEventListener("click", resetGame);
  
  // Reset game state
  score = 0;
  lives = 3;
  gameOver = false;
  gameStarted = false;
  gamePaused = false;
  
  // Update UI
  scoreElement.textContent = score;
  livesElement.textContent = lives;
  
  // Reset positions and speed
  paddleX = (canvas.width - paddleWidth) / 2;
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = 2;
  ballDY = -2;
  
  // Recreate bricks
  createBricks();
  
  // Add start game listener
  canvas.addEventListener("click", startGame, false);
  
  // Clear restart button reference
  window.restartButton = null;
  
  // Redraw the game
  draw();
}

// Main game loop
function draw() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameOver();
    // Remove any existing click event listeners first to avoid duplicates
    canvas.removeEventListener("click", startGame);
    canvas.removeEventListener("click", resetGame);
    // Add the click event listener for reset
    canvas.addEventListener("click", resetGame, false);
    return;
  }
  
  if (!gameStarted) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    drawStartScreen();
    return;
  }
  
  if (gamePaused) {
    drawPauseScreen();
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  
  // Ball wall collision
  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  
  // Ball top collision
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } 
  // Ball bottom collision (game over or life lost)
  else if (ballY + ballDY > canvas.height - ballRadius) {
    // Check if ball hits the paddle
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      // Calculate bounce angle based on where ball hits paddle
      const hitPosition = (ballX - paddleX) / paddleWidth;
      const angle = hitPosition * Math.PI - Math.PI/2; // -90 to 90 degrees
      
      const speed = Math.sqrt(ballDX * ballDX + ballDY * ballDY);
      ballDX = Math.cos(angle) * speed;
      ballDY = -Math.abs(Math.sin(angle) * speed); // Always bounce up
    } else {
      // Ball missed the paddle
      lives--;
      livesElement.textContent = lives;
      
      if (lives === 0) {
        gameOver = true;
      } else {
        // Reset ball and paddle position
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballDX = 2;
        ballDY = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  
  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  
  // Move ball
  ballX += ballDX;
  ballY += ballDY;
  
  // Continue game loop
  if (!gameOver && !gamePaused) {
    requestAnimationFrame(draw);
  } else if (gameOver) {
    // Make sure game over message is displayed
    ctx.font = "24px Arial";
    ctx.fillStyle = "#FF0000"; // Red color for emphasis
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER, click R to restart!", canvas.width / 2, canvas.height - 50);
    
    // Add event listener for R key if not already added
    if (!window.gameOverKeyListenerAdded) {
      window.gameOverKeyListenerAdded = true;
      document.addEventListener("keydown", function(e) {
        if ((e.key === "r" || e.key === "R") && gameOver) {
          resetGame({
            clientX: canvas.offsetLeft + canvas.width / 2,
            clientY: canvas.offsetTop + canvas.height / 2 + 70
          });
          window.gameOverKeyListenerAdded = false;
        }
      }, { once: true });
    }
  }
}

// Initialize game
createBricks();
draw();