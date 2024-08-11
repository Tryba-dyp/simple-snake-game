document.addEventListener('DOMContentLoaded', () => {
	// DOM elements
	const gameField = document.querySelector('.game-field');
	const head = document.querySelector('.head');
	const appleBox = document.querySelector('.apple-box');
	const scoreLabel = document.querySelector('.score');
	const messageLabel = document.querySelector('.message');

	// Game Constants
	const moveStep = head.clientWidth; // Step size for the snake, equal to the size of one "cell"
	const maxPosX = gameField.clientWidth - moveStep; // Maximum position along the X axis
	const maxPosY = gameField.clientHeight - moveStep; // Maximum position along the Y axis

	// Game State Variables
	let headPos = { x: 0, y: 0 };
	let snakePartsCoords = [{ x: headPos.x, y: headPos.y }];
	let applePos = { x: 0, y: 0 };
	let scoreValue = 0;
	let direction = 'right';
	let newDirection = direction;
	let tail = null;
	let gameTimerId;

	// Function to check collisions for the head and apple
	function checkCollision(snakeCoords, checkX, checkY) {
		return snakeCoords.some(
			partPos => partPos.x === checkX && partPos.y === checkY
		);
	}

	// Generate a new position for the apple
	function generateNewApplePos() {
		// Numbers equal to the number of "cells" on the playing field
		const maxValueX = Math.floor(maxPosX / moveStep);
		const maxValueY = Math.floor(maxPosY / moveStep);

		// Positions where the apple can be located
		const x = Math.floor(Math.random() * (maxValueX + 1)) * moveStep;
		const y = Math.floor(Math.random() * (maxValueY + 1)) * moveStep;

		// Ensure the apple doesn't spawn inside the snake's body
		if (checkCollision(snakePartsCoords, x, y)) {
			return generateNewApplePos(); // Recursion to generate a new position
		}

		return { x, y };
	}

	// Move the apple to a new location
	function moveApple() {
		const newPos = generateNewApplePos();
		applePos.x = newPos.x;
		applePos.y = newPos.y;
		appleBox.style.transform = `translate(${applePos.x}px, ${applePos.y}px)`;
	}

	// Add a new part to the snake's tail
	function addTailPart() {
		let tailPart = document.createElement('div');
		tailPart.className = 'part tail';
		gameField.prepend(tailPart);
		snakePartsCoords.push({
			x: snakePartsCoords[snakePartsCoords.length - 1].x,
			y: snakePartsCoords[snakePartsCoords.length - 1].y,
		});
	}

	// Start the game and set the snake's movement interval
	function startGame() {
		moveApple(); // Initial apple generation
		return setInterval(moveSnake, 150); // Move the snake every 150 milliseconds
	}

	// End the game and display a message
	function gameOver() {
		console.log('Snake: Oh no, I ate myself! Game over!');
		console.log(`Your final score: ${scoreValue}`);
		messageLabel.innerHTML = `
        <span class="game-over">GAME OVER!</span>
        <span class="restart-hint">(F5 to play again)</span>
    `;
		clearInterval(gameTimerId); // Stop the game
	}

	// Move the snake
	function moveSnake() {
		direction = newDirection; // Update the direction

		// Movement in the appropriate direction
		switch (direction) {
			case 'right':
				headPos.x += moveStep;
				break;
			case 'left':
				headPos.x -= moveStep;
				break;
			case 'up':
				headPos.y -= moveStep;
				break;
			case 'down':
				headPos.y += moveStep;
				break;
		}

		// Check for out-of-bounds movement
		if (headPos.x >= gameField.clientWidth) {
			headPos.x = 0;
		}
		if (headPos.x < 0) {
			headPos.x = maxPosX;
		}
		if (headPos.y >= gameField.clientHeight) {
			headPos.y = 0;
		}
		if (headPos.y < 0) {
			headPos.y = maxPosY;
		}

		// Check if the apple is eaten
		if (headPos.x === applePos.x && headPos.y === applePos.y) {
			console.log("Apple: Oh no, I got eaten! I'm moving to a new position!");
			scoreLabel.textContent = `${++scoreValue}`;
			console.log(`Score: ${scoreValue}`);
			addTailPart(); // Add a tail part when the apple is eaten
			moveApple(); // Generate a new apple
		}

		// Draw the movement of the snake's head and tail
		head.style.transform = `translate(${headPos.x}px, ${headPos.y}px)`;
		tail = document.querySelectorAll('.tail');

		for (let i = snakePartsCoords.length - 1; i > 0; i--) {
			snakePartsCoords[i] = { ...snakePartsCoords[i - 1] };
			tail[
				i - 1
			].style.transform = `translate(${snakePartsCoords[i].x}px, ${snakePartsCoords[i].y}px)`;
		}
		snakePartsCoords[0] = { x: headPos.x, y: headPos.y };

		// Self-eating check (Game Over)
		if (checkCollision(snakePartsCoords.slice(1), headPos.x, headPos.y)) {
			gameOver(); // End the game if a collision with itself occurs
		}
	}

	// Change the snake's direction
	function changeDirection(event) {
		switch (event.key) {
			case 'ArrowRight':
				if (direction !== 'left') newDirection = 'right';
				break;
			case 'ArrowLeft':
				if (direction !== 'right') newDirection = 'left';
				break;
			case 'ArrowUp':
				if (direction !== 'down') newDirection = 'up';
				break;
			case 'ArrowDown':
				if (direction !== 'up') newDirection = 'down';
				break;
		}
	}

	// Add event listener for changing direction
	document.addEventListener('keydown', changeDirection);

	// Start the game
	gameTimerId = startGame();
});
