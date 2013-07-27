(function() {

	var socket = io.connect('http://localhost');
	var canvas = window.document.getElementsByClassName('canvas')[0];
	var context = canvas.getContext('2d');
	canvas.width = window.document.width;
	canvas.height = window.document.height;

	var makeSquare = function() {
		return {
			size: 50,
			speed: 20,
			topX: 0,
			topY: 0,
			bottomX: 0,
			bottomY: 0
		};
	};

	var square = makeSquare();
	var boundry = makeSquare();

	window.document.addEventListener('keydown', function(event) {
		var key = event.keyCode;
		var dirMap = {
			37: square.left,
			38: square.up,
			39: square.right,
			40: square.down
		};

		if (dirMap[key]) {
			dirMap[key]();
		}
	});

	square.setSquareX = function(x) {
		square.topX = x;
		square.bottomX = square.topX + square.size;
	};

	square.setSquareY = function(y) {
		square.topY = y;
		square.bottomY = square.topY + square.size;
	};

	square.setSquareSize = function(size) {
		square.size = size;
		square.bottomY = square.topY + square.size;
		square.bottomX = square.topX + square.size;
	};

	square.left = function() {
		square.setSquareX(square.topX - square.speed);
	};

	square.right = function() {
		square.setSquareX(square.topX + square.speed);
	};

	square.up = function() {
		square.setSquareY(square.topY - square.speed);
	};

	square.down = function() {
		square.setSquareY(square.topY + square.speed);
	};


	var drawBackground = function() {
		context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width, canvas.height);
	};

	var drawSquare = function(square) {
		context.fillStyle = 'green';
		context.fillRect(square.topX, square.topY, square.size, square.size);
	};

	socket.on('potread', function(data) {
		square.setSquareSize(data);
	});

	var initSquarePosition = function() {
		square.setSquareX(canvas.width / 2);
		square.setSquareY(canvas.height / 2);
	};

	var mainLoop = function() {
		window.requestAnimationFrame(mainLoop);
		drawBackground();
		drawSquare(square);
	};

	initSquarePosition();
	mainLoop();

}());
