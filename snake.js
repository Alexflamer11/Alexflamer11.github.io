"use strict"; // Neater code

/* MAIN VARIABLES */
var movementInterval = null;
var ignoreLastPart = false;
var paused = false;
var currentScore = 0;
var highscore = 0;
var addToSnake = 0;





/* MISCELLANEOUS INITIALIZERS */

// Handle the popups visibilities (part of the webpage but here for game popups) and only allow 1 to be visible along with bring to front
var handlePopups = function(newPopup) {
	if (newPopup) {
		let toSet = newPopup;
		for (let pIndex = 0; pIndex < popupOrder.length; pIndex++) {
			let array = popupOrder[pIndex];
			if (array[1] === newPopup[1]) {
				body.removeChild(newPopup[0])
				toSet = popupOrder.splice(pIndex, 1)[0];
				toSet[0].hidden = false;
				break;
			}
		}
		if (popupOrder.length > 0) {
			popupOrder[popupOrder.length - 1][0].hidden = true;
		}
		popupOrder[popupOrder.length] = newPopup;
	} else {
		popupOrder.pop();
		if (popupOrder.length > 0) {
			popupOrder[popupOrder.length - 1][0].hidden = false;
		}
	}
};





/* KEYBOARD INPUT */

// Function to set the direction without having 4+ if statements
var keyPressed = function(direction, toSet) {
	event.preventDefault(); // Prevent default arrows from happening only if a movement key was pressed
	let stillSet = true; // Variable so settings all the variables is not needed in every statement
	
	let dir = toSet === 0 ? 0 : 1; // Left/Right = 0 - Up/Down = 1
	let opp = toSet === 0 ? 1 : 0; // Same case just set the opposite value to 0
	
	// Make sure the snake doesnt go back into itself (screen wrap is a little more complicated)
	if ((snake.length > 1 && snake[0][dir] + direction != snake[1][dir]) || snake.length === 1) {
		if (screenWrap && snake.length !== 1) { // If screen wrap is enabled AND the snake's length is greater than 1
			let boardSize = toSet === 0 ? board.boardTilesWidth - 1 : board.boardTilesHeight - 1; // Get the appropriate height/width size
			let newPos = snake[0][dir] + direction; // Save the new position for easy reference
			let check = newPos < 0 ? boardSize : 0; // Set the direction to check
			
			// Get the next position
			if (newPos < 0) {
				newPos = boardSize;
			} else if (newPos >= boardSize) {
				newPos = 0;
			}
			
			// Check the positioning
			if (newPos === snake[1][dir]) {				
				stillSet = false;
			}
		}
		
		if (stillSet) {
			movement[dir] = direction;
			movement[opp] = 0;
		}
	}
	
	// Start the game if not started already
	if (gameStarted === false && newGame === true) {
		gameStarted = true;
		newGame = false;
		movementInterval = setInterval(movementIntervalFunc, 1000 / speed); // Convert blocks a second to something the function can use
	}
	
	// Old movement (up)
	//movement[1] = -1;
	//movement[0] = 0;
};

// Movement parser
document.onkeydown = function(event) {
	let key = event.keyCode;
	
	// Enter key to pause the game
	if (key == 13) {
		wasPaused = !wasPaused;
		pauseGame();
		return;
	}
	
	if (paused === false) {
		for (let keysIndex = 0; keysIndex < keys.length; keysIndex++) {
			if (key == keys[keysIndex].up) {
				keyPressed(-1, 1);
			} else if (key == keys[keysIndex].down) {
				keyPressed(1, 1);
			} else if (key == keys[keysIndex].left) {
				keyPressed(-1, 0)
			} else if (key == keys[keysIndex].right) {
				keyPressed(1, 0);
			}
		}
	}
};





/* SNAKE SIZING AND MOVEMENT */

// Add new body part to the snake
var addBodyPart = function() {
	let lastBodyPart = snake[snake.length - 1];
	
	snake[snake.length] = [
		lastBodyPart[0],
		lastBodyPart[1],
	];
	
	ignoreLastPart = true;
	
	// Increase the high score counter
	let score = snake.length - initialLength + addToSnake
	if (score > highscore) {
		highscore = score;
		highscoreDiv.innerHTML = "Highscore: " + highscore.toString();
	}
};

// Move the body of the snake
var moveBody = function(ignoreLast) {
	// Iterate throught the body of the snake, starting after the head
	for (let bodyIndex = snake.length - 1; bodyIndex > 0; bodyIndex--) {
		let bodyPart = snake[bodyIndex];
		
		if ((ignoreLast === true && bodyIndex != snake.length - 1) || ignoreLast === false) {
			bodyPart[0] = snake[bodyIndex - 1][0];
			bodyPart[1] = snake[bodyIndex - 1][1];
		}
		
		// Render body parts
		if (showSegments) {
			ctx.borderedRect(bodyPart[0] * board.tileWidth, bodyPart[1] * board.tileHeight, board.tileWidth, board.tileHeight, 1, snakeColors.border, snakeColors.body, snakeColors.border);
		} else {
			ctx.beginPath();
			ctx.fillStyle = snakeColors.body;
			ctx.fillRect(bodyPart[0] * board.tileWidth, bodyPart[1] * board.tileHeight, board.tileWidth, board.tileHeight);
		}
	}
	
	if (ignoreLastPart && addToSnake === 0) {
		ignoreLastPart = false;
	}
};

// Move the head of the snake
var moveSnake = function() {
	// Create board and all its info
	createBoard();
	
	// Add to the snake and decrease the snake counter by 1
	if (addToSnake > 0) {
		addToSnake -= 1;
		addBodyPart(); // Add before everything moves to get movement
	}
	
	// Move body parts (move body parts first because their position is set to whatever the body part before it is)
	if (snake.length > 1) {
		moveBody(ignoreLastPart);
	}
	
	// Move snake's head position
	snake[0][0] += snake[0][2][0];
	snake[0][1] += snake[0][2][1];
	
	// Get X and Y - Used in screen wrap and ending the game
	let snakeX = snake[0][0];
	let snakeY = snake[0][1];
	
	// Screen wrap logic
	if (screenWrap) {
		if (snakeX < 0 || snakeX >= board.boardTilesWidth) { // X check
			snake[0][0] = snakeX < 0 ? board.boardTilesWidth - 1 : 0;
			snakeX = snake[0][0]; // Set the snakeX variable again
		} else if (snakeY < 0 || snakeY >= board.boardTilesHeight) { // Y check
			snake[0][1] = snakeY < 0 ? board.boardTilesHeight - 1: 0;
			snakeY = snake[0][1]; // Set the snakeY variable again
		}
	}
	
	// Collision check
	checkHeadCollision(snake[0][0], snake[0][1]);
	
	// Create the snake
	ctx.beginPath();
	ctx.fillStyle = snakeColors.head;
	ctx.fillRect(snake[0][0] * board.tileWidth, snake[0][1] * board.tileHeight, board.tileWidth, board.tileHeight);
	
	// Out of bounds check (should never trigger if screen wrap is on)
	if ((snakeX < 0 || snakeX >= board.boardTilesWidth) || (snakeY < 0 || snakeY >= board.boardTilesHeight)) {
		endGame();
	}
};





/* BOARD RELATED FUNCTIONS */

// Set board size to the screen size / auto or custom size if set
var resizeBoard = function(width, height) {
	// Get the number of tiles the board should have
	let row = boardSize.width === 0 ? Math.floor(width / board.tileWidth) : boardSize.width;
	let col = boardSize.height === 0 ? Math.floor(height / board.tileHeight) : boardSize.height;
	
	// Set the board width and height evenly
	let newWidth = row * board.tileWidth;
	let newHeight = col * board.tileHeight;
	
	// Set the board to appropriate size
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	// Return data for future use if any
	return [row, col];
};

// Create the playing field
var createBoard = function() {
	// Set the playing fields width and get the rows/columns
	let data = resizeBoard(window.innerWidth - 16, window.innerHeight - 50 - 50);
	let rows = data[0];
	let columns = data[1];
	
	board.boardTilesWidth = rows;
	board.boardTilesHeight = columns;
	
	// Clear the board before anything else
	ctx.clearRect(0, 0, rows * board.tileWidth, columns * board.tileHeight);
	
	// Lay board background
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.fillRect(0, 0, rows * board.tileWidth, columns * board.tileHeight);
	
	// Lay down the tiles
	if (showTiles) {
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < columns; col++) {
				ctx.borderedRect(row * board.tileWidth, col * board.tileHeight, board.tileWidth, board.tileHeight, 1, "#000000", boardColor, "#000000");
			}
		}
	}
	
	// Place food
	if (!board.food[0] && !board.food[1]) {
		layFood();
	}
	
	// Fix food position on resize
	if (board.food[0] >= rows || board.food[1] >= columns) {
		layFood();
	}
	
	// Draw the food on the board
	ctx.beginPath();
	ctx.fillStyle = foodColor;
	ctx.fillRect(board.food[0] * board.tileHeight, board.food[1] * board.tileWidth, board.tileHeight, board.tileWidth);
};

var createNewGame = function(showIntro) {
	// Reset all information
	snake = []; // Reset the snake for new games
	snake[0] = [5, 5, movement, [5, 5]]; // x, y, direction, last position
	addToSnake = initialLength === 0 ? 0 : initialLength - 1; // If the snake length starts off with more than 1 body part, decrease it by 1 to account for the head
	
	if (showIntro) {
		board.food = [];
	}
	
	// Continue with the game
	createBoard();
	
	// Create the snake
	ctx.beginPath();
	ctx.fillStyle = snakeColors.head;
	ctx.fillRect(snake[0][0] * board.tileWidth, snake[0][1] * board.tileHeight, board.tileWidth, board.tileHeight);
	
	// Create the initial game popup
	if (showIntro) {
		// Show a list of keys in a neat fasion
		let stringKeys;
		if (keys.length <= 2) {
			stringKeys = keys.length === 1 ? keys[0].name : keys[0].name + " or " + keys[1].name;
		} else {
			stringKeys = keys[0].name;
			for (let keySet = 1; keySet < keys.length; keySet++) {
				if (keySet !== keys.length - 1) {
					stringKeys = stringKeys + ", " + keys[keySet].name;
				} else {
					stringKeys = stringKeys + ", or " + keys[keySet].name;
				}
			}
		}
		
		// Create the popup
		createGamePopup("Javascript Snake", "Use " + stringKeys + " to move.", "Start Game", function() {
			window.scrollTo(0, window.innerHeight); // Send to the bottom of the page
			newGame = true;
		});
	} else if (!gameStarted) {
		scoreDiv.innerHTML = "Length: 0";
	}
};

var resizeGame = function() {
	// Continue with the game
	createBoard();
	
	// Create the snake
	ctx.beginPath();
	ctx.fillStyle = snakeColors.head;
	ctx.fillRect(snake[0][0] * board.tileWidth, snake[0][1] * board.tileHeight, board.tileWidth, board.tileHeight);
};





/* BACKGROUND LOGIC */

// Logic for placing food
var layFood = function() {
	// Get value between 0 and number of tiles for both width and height
	let x = Math.floor(Math.random() * board.boardTilesWidth);
	let y = Math.floor(Math.random() * board.boardTilesHeight);
	
	// Get player position to test against
	for (let bodyIndex = 0; bodyIndex < snake.length; bodyIndex++) {
		let pX = snake[bodyIndex][0];
		let pY = snake[bodyIndex][1];

		// Check to make sure food is not is the player, else lay food
		if (x === pX && y === pY) {
			return layFood();
		}
	}
	
	board.food[0] = x;
	board.food[1] = y;
};

// Logic for checking the the head of the snake collided with other body parts or food
var checkHeadCollision = function(x, y) {
	// Check for food
	if (x == board.food[0] && y == board.food[1]) {
		//scoreDiv.innerHTML = "Length: " + (snake.length - initialLength + addToSnake + 1).toString();
		currentScore += eatInc;
		scoreDiv.innerHTML = "Length: " + currentScore.toString();
		addToSnake += eatInc; // Add to snake counter instead of directly add body part to prevent multiple body parts from spawning at a time
		layFood();
	}
	
	// Check collision
	if (snake.length > 2) { // If the snake is greater than 2 length because otherwise it kills itself on the first food
		for (let bodyIndex = 1; bodyIndex < snake.length; bodyIndex++) {
			let bodyPart = snake[bodyIndex];
			if (x === bodyPart[0] && y === bodyPart[1]) {
				endGame();
				return;
			}
		}
	}
};

// End the game
var endGame = function() {
	if (movementInterval != null) {
		gameStarted = false;
		gameEnded = true;
		clearInterval(movementInterval);
		movementInterval = null;
		createGamePopup("Game Over", "Final Length: " + (snake.length - initialLength).toString(), "Play again", function() {
			window.scrollTo(0, window.innerHeight); // Send to the bottom of the page
			createNewGame();
			newGame = true;
		});
	}
};

// Create the play game popup and others
var createGamePopup = function(title, text, buttonText, func) {
	var mainDiv = create("div", {className: "game-popup"}, gameDiv);
	var title = create("h2", {innerHTML: title}, mainDiv);
	var body = create("p", {innerHTML: text}, mainDiv);
	var button = create("button", {className: "popup-button", innerHTML: buttonText}, mainDiv);
	button.onclick = function() {
		handlePopups();
		gameDiv.removeChild(mainDiv);
		func();
	};
	
	handlePopups([mainDiv, -1]);
};

// Pause game function
var pauseGame = function(stayPaused) {
	if (gameStarted) {
		if (movementInterval) {
			paused = true;
			clearInterval(movementInterval);
			movementInterval = null;
		} else if (!stayPaused && popupOrder.length < 1) {
			paused = false;
			movementInterval = setInterval(movementIntervalFunc, 1000 / speed);
		}
	}
};





/* FINALIZATION */

// Create the board
setTimeout(createNewGame, 50, true);

// Snake movement controller
var movementIntervalFunc = function() {
	moveSnake();
};

// Resize the game when the window is resized
window.onresize = function() {
	resizeGame();
};