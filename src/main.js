(function() {

	var socket = io.connect('http://localhost');
	var canvas = window.document.getElementsByClassName('canvas')[0];
	var context = canvas.getContext('2d');
	canvas.width = window.document.width;
	canvas.height = window.document.height;

	document.addEventListener('keydown', function(event) {
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

	var square = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		size: 50,
		square.speed: 20
	};

	square.left = function() {
		square.x -= square.speed;
	};

	square.right = function() {
		square.x += square.speed;
	};

	square.up = function() {
		square.y -= square.speed;
	};

	square.down = function() {
		square.y += square.speed;
	};

	var drawBackground = function() {
		context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width, canvas.height);
	};

	var drawSquare = function(square) {
		context.fillStyle = 'green';
		context.fillRect(square.x, square.y, square.size, square.size);
	};

	var setSquareSize = function(size) {
		square.size = size;
	};

	socket.on('potread', function(data) {
		setSquareSize(data);
	});

	var mainLoop = function() {
		window.requestAnimationFrame(mainLoop);
		drawBackground();
		drawSquare(square);
	};

	mainLoop();

}());
