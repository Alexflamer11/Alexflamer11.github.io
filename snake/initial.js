/*

TODO:

Add movement keys

Make 2 player

Create a nice page of options (WIP)

*/

/* ---Main Settings--- */
var screenWrap = false; // Wrap the snake around the screen instead of dying
var initialLength = 5; // How many body parts should the snake start with / counter for adding more parts
var eatInc = 1; // How many body parts should the snake get with each food
var showTiles = false; // Show background tiles
var showSegments = true; // Show each snake body part

var currentDifficulty = "Medium"; // Must match a difficutly
var difficulties = { // Each difficutly with how many tiles a second each should be
	Easy: 10,
	Medium: 20,
	Hard: 30,
	NaN: NaN // Seems to steady at 250
};

var boardColor = "#7D7D7D";
var foodColor = "#FF0000";
var snakeColors = {
	head: "#000000",
	body: "#C8C8C8",
	border: "#999999"
};

// 0 for automatic or set the size to whatever you want
var boardSize = {
	width: 0,
	height: 0
};

// Size of the tiles (in pixels, default is 25 x 25 pixels)
var tileSize = {
	width: 25,
	height: 25
};

// Keys for game movemnt (wasd and arrows, any key pressed has default disabled)
var keys = [
	{
		name: "WASD",
		up: 87,
		left: 65,
		down: 83,
		right: 68
	},
	
	{
		name: "ARROW KEYS",
		up: 38,
		left: 37,
		down: 40,
		right: 39
	}
];

/* ---End of Main Settings--- */
// Touching stuff down below this is dangerous





// HTML Contents
const imageContainer = document.getElementById("snake-images");
const gameDiv = document.getElementById("game-container");
const highscoreDiv = document.getElementById("highscore");
const scoreDiv = document.getElementById("score");
const canvas = document.getElementById("SnakeCanvas");
const ctx = canvas.getContext("2d");

// Main variables
var gameStarted = false;
var gameEnded = false;
var newGame = false;

// For popups
var popupOrder = []; // Make it so only 1 popup is ever open
var keepGamePaused = false;
var wasPaused = false;

// Miscellaneous
var speed = difficulties[currentDifficulty];

// Direction logger for each frame - left/right and up/down (0/1)
var movement = [1, 0];

// Snake bodyparts
var snake = [];

// Board info
var board = {
	food: [], // Food position
	tileWidth: tileSize.width, // Tile width
	tileHeight: tileSize.height, // Tile height
	boardTilesWidth: 0, // Number of tiles left to right
	boardTilesHeight: 0 // Number of tiles top to bottom
};
