var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var five = require('johnny-five')
var board = new five.Board();
var potentiometer;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/main.js', function(req, res){
  res.sendfile('main.js');
});

server.listen(8000);

board.on("ready", function() {
	potentiometer = new five.Sensor({
	    pin: "A2",
	    freq: 250
	});
});

io.sockets.on('connection', function (socket) {
	potentiometer && potentiometer.on("read", function( err, value ) {
		socket.emit('potread', this.normalized);
	});
});
