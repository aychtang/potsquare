(function() {
	// max square size is 240.
	var score = 0;
	var socket = io.connect('http://localhost');
	var canvas = window.document.getElementsByClassName('canvas')[0];
	var context = canvas.getContext('2d');
	canvas.width = window.document.width;
	canvas.height = window.document.height;
	context.font = "20pt Arial";

	squareMethods = {};

	squareMethods.setSquareX = function(x) {
		this.topX = x;
		this.bottomX = this.topX + this.size;
	};

	squareMethods.setSquareY = function(y) {
		this.topY = y;
		this.bottomY = this.topY + this.size;
	};

	squareMethods.setSquareSize = function(size) {
		this.size = size;
		this.bottomY = this.topY + this.size;
		this.bottomX = this.topX + this.size;
	};

	squareMethods.left = function() {
		this.setSquareX(this.topX - this.speed);
	};

	squareMethods.right = function() {
		this.setSquareX(this.topX + this.speed);
	};

	squareMethods.up = function() {
		this.setSquareY(this.topY - this.speed);
	};

	squareMethods.down = function() {
		this.setSquareY(this.topY + this.speed);
	};

	var makeSquare = function() {
		var square = Object.create(squareMethods);
		var initialSettings = {
			size: 50,
			speed: 10,
			topX: 0,
			topY: 0,
			bottomX: 0,
			bottomY: 0
		};

		for (var property in initialSettings) {
			square[property] = initialSettings[property];
		}

		return square;
	};

	var square = makeSquare();
	var boundry = makeSquare();

	square.isInBoundry = function() {
		var topXDiff = Math.abs(square.topX - boundry.topX);
		var topYDiff = Math.abs(square.topY - boundry.topY);
		var bottomXDiff = Math.abs(square.bottomX - boundry.bottomX);
		var bottomYDiff = Math.abs(square.bottomY - boundry.bottomY);
		if (topXDiff < 15 && topXDiff > -15 && topYDiff < 15 && topYDiff > -15 && bottomXDiff < 15 && bottomXDiff > -15 && bottomYDiff < 15 && bottomYDiff > -15) {
			return true;
		}
	};

	square.outOfBounds = function() {
		if (square.topX < 0 || square.topX + square.size > document.width || square.bottomY - square.size < 0 || square.bottomY > document.height) {
			return true;
		}
	};

	var keys = {};

	var dirMap = {
		37: square.left,
		38: square.up,
		39: square.right,
		40: square.down
	};

	window.document.addEventListener('keydown', function(event) {
		var keyCode = event.keyCode;
		if (dirMap[keyCode]) {
			keys[keyCode] = true;
		}
	});

	window.document.addEventListener('keyup', function(event) {
		var keyCode = event.keyCode;
		keys[keyCode] && (delete keys[keyCode]);
	});

	var wholeNumRandomRange = function(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	};

	var drawBackground = function() {
		context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width, canvas.height);
	};

	var drawSquare = function(square) {
		context.fillStyle = 'green';
		context.fillRect(square.topX, square.topY, square.size, square.size);
	};

	var drawBoundry = function(boundry) {
		context.strokeStyle = 'white';
		context.beginPath();
		context.moveTo(boundry.topX, boundry.topY); // top left.
		context.lineTo(boundry.topX + boundry.size, boundry.topY) // top right.
		context.lineTo(boundry.bottomX, boundry.bottomY) // bottom right.
		context.lineTo(boundry.bottomX - boundry.size, boundry.bottomY); // bottom left.
		context.lineTo(boundry.topX, boundry.topY)
		context.stroke();
	};

	socket.on('potread', function(data) {
		square.setSquareSize(data);
	});

	var initSquarePosition = function() {
		setNewSquare(square, canvas.width / 2, canvas.height / 2, 50);
	};

	var initBoundryPosition = function() {
		setNewSquare(boundry, 360, 200, 120);
	};

	var setNewSquare = function(square, x, y, size) {
		square.setSquareX(x);
		square.setSquareY(y);
		size && square.setSquareSize(size);
	};

	var winning = function() {
		var size =  wholeNumRandomRange(20, 240);
		var x = wholeNumRandomRange(0, canvas.width - size);
		var y = wholeNumRandomRange(0, canvas.height - size);

		setNewSquare(boundry, x, y, size);
		score += 1;
	};

	var losing = function() {
		setNewSquare(square, canvas.width / 2, canvas.height / 2);
		score -= 1;
	};

	var renderScore = function() {
		context.fillStyle = "turquoise";
		context.fillText("Score: " + score, 20, 40);
	};

	var mainLoop = function() {
		window.requestAnimationFrame(mainLoop);

		for (var key in keys) {
			if (dirMap[key]) {
				dirMap[key].bind(square)();
			}
		}

		drawBackground();
		drawSquare(square);
		drawBoundry(boundry);
		renderScore();

		if (square.isInBoundry()) {
			winning();
		}

		if (square.outOfBounds()) {
			losing();
		}
	};

	initBoundryPosition();
	initSquarePosition();
	mainLoop();

}());
