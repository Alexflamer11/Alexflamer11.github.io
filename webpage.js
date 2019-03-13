"use strict"; // Neater code

/* MAIN VARIABLES */

const body = document.body;





/* MISCELLANEOUS FUNCTIONS */

// Hover events function
var addHoverEvents = function(element, toChange) {
	element.onmouseover = function() {
		toChange.hidden = false;
	};
	
	element.onmouseout = function() {
		toChange.hidden = true;
	};
};

// Function to add hover events to selected objects
var mouseover = function(div, child) {
	addHoverEvents(div, child);
	addHoverEvents(child, child);
};

// Popup button controller (to copy paste less)
var closeSettings = function(div, handler, args) {
	if (handler) {
		handler(args);
	}
	
	body.removeChild(div);
	
	handlePopups();
	
	if (popupOrder.length === 0 && !wasPaused) {
		wasPaused = false;
		pauseGame();
	}
};

// Custom popup (Options - 1: Number, 2: Toggle)
var settingsPopup = function(id, titleText, options, handler) {
	if (popupOrder.length === 0 || popupOrder[popupOrder.length - 1][1] != id) { // Prevent duplicates
		let mainDiv = create("div", {className: "settings-popup game-popup"}, body);
		let title = create("h2", {innerHTML: titleText}, mainDiv);

		// Create all the options
		let optionsArray = [];
		for (let option = 0; option < options.length; option++) {
			let div = create("div", {className: "option-container"}, mainDiv);
			let optionSpan = create("span", {innerHTML: options[option][1] + ": ", className: "left"}, div);
			let optionInput;

			// Create the input
			let optionType = options[option][0];
			let content = options[option][2];
			if (optionType === 1) {
				optionInput = create("input", {type: "number", className: "settings-input", value: content}, div);
			} else if (optionType === 2) {
				let enabledClass = content ? "enabled" : "disabled";
				let innerHTML = content ? "Enabled" : "Disabled";
				let optionButton = create("button", {className: "settings-input settings-button " + enabledClass, innerHTML: innerHTML}, div);

				// Click event
				optionButton.onclick = function() {
					let enabled = optionButton.innerHTML === "Enabled";
					if (enabled) {
						optionButton.className = "settings-input settings-button disabled"
						optionButton.innerHTML = "Disabled";
					} else {
						optionButton.className = "settings-input settings-button enabled"
						optionButton.innerHTML = "Enabled"
					}
				}

				optionInput = optionButton;
			}

			// Add the element to the array to be returned
			optionsArray.push(optionInput);
		}

		// Breaks between inputs and buttons
		create("br", {}, mainDiv);

		// Save and cancel buttons
		let save = create("button", {innerHTML: "Save", className: "save-cancel"}, mainDiv);
		let cancel = create("button", {innerHTML: "Cancel", className: "save-cancel"}, mainDiv);

		// Save and close buttons
		save.onclick = function() { closeSettings(mainDiv, handler, optionsArray) };
		cancel.onclick = function() { closeSettings(mainDiv) };

		// Pause the game
		keepGamePaused = true;
		pauseGame(true);

		// Increase popup counter
		handlePopups([mainDiv, id]);

		// Return the boxes / settings stuff
		return optionsArray;
	}
};





/* DIFFICULTY FUNCTIONS */

// HTML Elements
const difficultyDropdownDiv = document.getElementById("difficultyDropdown");
const difficultyButton = document.getElementById("difficultyDropdownButton");

// Set the default difficulty right away
difficultyButton.innerHTML = "Difficulty<br>" + currentDifficulty;

// Make the difficulties shown
mouseover(difficultyButton, difficultyDropdownDiv);

// List the difficulties
for (let difficulty in difficulties) {
	let button = create("div", {innerHTML: difficulty}, difficultyDropdownDiv);
	button.onclick = function() {
		// Change some nice variables around
		currentDifficulty = difficulty; // Variable not currently used anywhere else but the initial loading but gets changed for future use if any
		speed = difficulties[difficulty]; // Set the current speed
		
		// Update the current speed if the game is running
		if (movementInterval) {
			clearInterval(movementInterval); // Clear the current interval
			movementInterval = setInterval(movementIntervalFunc, 1000 / speed); // Set the new speed
		}
		
		// Set the text to the current difficulty and hide the menu again
		difficultyButton.innerHTML = "Difficulty<br>" + difficulty;
		difficultyDropdownDiv.hidden = true;
	};
}

// Custom difficulty
var customDifficulty = create("div", {innerHTML: "Custom"}, difficultyDropdownDiv);
customDifficulty.onclick = function() {
	settingsPopup(0, "Custom Difficulty", [
		[1, "Tiles a second", speed]
	], function(inputs) {
		let newSpeed = parseInt(inputs[0].value);
		if (newSpeed) {
			speed = newSpeed;
			
			// Update the current speed if the game is running
			if (movementInterval) {
				clearInterval(movementInterval); // Clear the current interval
				movementInterval = setInterval(movementIntervalFunc, 1000 / speed); // Set the new speed
			}
			
			// Set the text to the current difficulty and hide the menu again
			difficultyButton.innerHTML = "Difficulty<br>Custom";
		}
	});
	
	// Hide the menu again
	difficultyDropdownDiv.hidden = true;
};





/* GAME SETTINGS */

// HTML Elements
const gameSettingsDropdownDiv = document.getElementById("gameSettingsDropdownDiv");
const gameSettingsButton = document.getElementById("gameSettingsButton");

const gameSettings = document.getElementById("gameSettings");

// Make the screen wrap toggles shown
mouseover(gameSettingsButton, gameSettingsDropdownDiv);

// Game Settings
gameSettings.onclick = function() {
	let settings = settingsPopup(1, "Game Settings", [
		[1, "Eat Increment", eatInc],
		[1, "Starting Length", initialLength],
		[2, "Screen Wrap", screenWrap],
		[2, "Show Segments", showSegments]
	], function(inputs) {
		let eatIncrement = parseInt(inputs[0].value);
		let startingLength = parseInt(inputs[1].value);
		let wrap = inputs[2].innerHTML === "Enabled" ? true : false;
		let segments = inputs[3].innerHTML === "Enabled" ? true : false;
		
		eatInc = eatIncrement || eatIncrement === 0 ? eatIncrement : eatInc;
		screenWrap = wrap;
		showSegments = segments;
		
		if (startingLength) {
			initialLength = startingLength;
			if (!gameStarted) {
				createNewGame();
			}
		}
	});
	
	// Hide the menu again
	gameSettingsDropdownDiv.hidden = true;
};





/* BOARD SETTINGS */

// HTML Elements
const boardSettingsDropdownDiv = document.getElementById("boardSettingsDropdownDiv");
const boardSettingsButton = document.getElementById("boardSettingsButton");

const boardSettings = document.getElementById("boardSettings");

// Make the screen wrap toggles shown
mouseover(boardSettingsButton, boardSettingsDropdownDiv);

// Board Settings
boardSettings.onclick = function() {
	let settings = settingsPopup(2, "Board Settings", [
		[1, "Board Width", boardSize.width],
		[1, "Board Height", boardSize.height],
		[1, "Tile Width", board.tileWidth],
		[1, "Tile Height", board.tileHeight],
		[2, "Show Tiles", showTiles]
	], function(inputs) {
		let newBoardWidth = parseInt(inputs[0].value);
		let newBoardHeight = parseInt(inputs[1].value);
		
		let newTileWidth = parseInt(inputs[2].value);
		let newTileHeight = parseInt(inputs[3].value);
		
		let newShowTiles = inputs[4].innerHTML === "Enabled" ? true : false;
		
		boardSize.width = newBoardWidth || newBoardWidth === 0 ? newBoardWidth : boardSize.width;
		boardSize.height = newBoardHeight || newBoardHeight === 0 ? newBoardHeight : boardSize.height;
		
		board.tileWidth = newTileWidth || newTileWidth === 0 ? newTileWidth : board.tileWidth;
		board.tileHeight = newTileHeight || newTileHeight === 0 ? newTileHeight : board.tileHeight;
		
		showTiles = newShowTiles;
		
		resizeGame();
	});
	
	// Hide the menu again
	boardSettingsDropdownDiv.hidden = true;
};