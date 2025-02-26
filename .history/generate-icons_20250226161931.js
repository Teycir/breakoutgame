const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to generate icon
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Background
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(0, 0, size, size);
  
  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, size - ctx.lineWidth, size - ctx.lineWidth);
  
  // Ball
  const ballRadius = size / 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Paddle
  const paddleHeight = size / 12;
  const paddleWidth = size / 2;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect((size - paddleWidth) / 2, size - paddleHeight - size/12, paddleWidth, paddleHeight);
  
  // Bricks
  const brickRows = 3;
  const brickCols = 3;
  const brickHeight = size / 16;
  const brickWidth = size / 4;
  const brickPadding = size / 32;
  const brickOffsetTop = size / 6;
  
  const colors = ['#FF0000', '#FF7F00', '#FFFF00'];
  
  for (let r = 0; r < brickRows; r++) {
    for (let c = 0; c < brickCols; c++) {
      const brickX = (c * (brickWidth + brickPadding)) + (size - (brickCols * (brickWidth + brickPadding) - brickPadding)) / 2;
      const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
      
      ctx.fillStyle = colors[r];
      ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
    }
  }
  
  return canvas.toBuffer('image/png');
}

// Generate and save icons
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const iconBuffer = generateIcon(size);
  fs.writeFileSync(`icon${size}.png`, iconBuffer);
  console.log(`Generated icon${size}.png`);
});

console.log('All icons generated successfully!');