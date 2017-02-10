var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + "/public"));

io.on("connection", function(socket) {
	console.log("User connected via Socket.io!");

	socket.on("message", function(message) {
		console.log("Message received: " + message.text);
		console.log("Time received (UTC): " + message.msgTime);
		io.emit("message", message); // everybody including sender
		//socket.broadcast.emit("message", message); //everybody except sender
	});

	socket.emit("message", {
		text: "Welcome to the Chat App!",
		msgTime: now.format("YYYY-MM-DD hh:mm:ss") // now.valueOf() //unix timestamp
	});
});

http.listen(PORT, function() {
	console.log("Server started at port:" + PORT + "!");
});