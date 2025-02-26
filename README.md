# Breakout Classic Chrome Extension

A classic Breakout brick-breaking game implemented as a Chrome extension.

## Features

- Classic Breakout gameplay
- Score tracking with high score saved using Chrome storage
- Multiple lives
- Colorful bricks with different point values
- Increasing difficulty as you progress

## Installation Instructions

1. Generate the icon files:
   - Open the `icon-generator.html` file in your browser
   - Click the "Generate Icons" button
   - Download each icon using the download buttons
   - Make sure the icons are saved as `icon16.png`, `icon48.png`, and `icon128.png` in the extension directory

2. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right corner
   - Click "Load unpacked" and select the extension directory
   - The extension should now appear in your Chrome toolbar

## How to Play

1. Click the extension icon in your Chrome toolbar to open the game
2. Click anywhere on the game canvas to start
3. Use your mouse or left/right arrow keys to move the paddle
4. Break all the bricks to advance to the next level
5. Press 'P' to pause the game

## Game Controls

- **Mouse Movement**: Move the paddle
- **Left/Right Arrow Keys**: Move the paddle
- **P Key**: Pause/Resume game
- **Space Bar**: Start game (alternative to clicking)

## Files Included

- `manifest.json`: Extension configuration
- `popup.html`: Main HTML file for the extension popup
- `game.js`: Game logic and functionality
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons (to be generated)
- `icon-generator.html`: Tool to generate the required icon files

## Development

To modify the game, you can edit the following files:
- `game.js`: Contains all the game logic
- `popup.html`: Contains the HTML structure and CSS styling

## License

This project is open source and available for personal and educational use.