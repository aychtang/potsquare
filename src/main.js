(function() {

	var socket = io.connect('http://localhost');
	var canvas = window.document.getElementsByClassName('canvas')[0];
	var context = canvas.getContext('2d');
	canvas.width = window.document.width;
	canvas.height = window.document.height;

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
			speed: 20,
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
		if (topXDiff < 5 && topXDiff > -5 && topYDiff < 5 && topYDiff > -5 && bottomXDiff < 5 && bottomXDiff > -5 && bottomYDiff < 5 && bottomYDiff > -5) {
			return true;
		}
	};

	window.document.addEventListener('keydown', function(event) {
		var key = event.keyCode;
		var dirMap = {
			37: square.left,
			38: square.up,
			39: square.right,
			40: square.down
		};

		if (dirMap[key]) {
			dirMap[key].bind(square)();
		}
	});


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
		square.setSquareX(canvas.width / 2);
		square.setSquareY(canvas.height / 2);
	};

	var initBoundryPosition = function() {
		boundry.setSquareX(360);
		boundry.setSquareY(200);
	};

	var mainLoop = function() {
		window.requestAnimationFrame(mainLoop);
		drawBackground();
		drawSquare(square);
		drawBoundry(boundry);

		if (square.isInBoundry()) {
			console.log('winning');
		}
	};

	initBoundryPosition();
	initSquarePosition();
	mainLoop();

}());
