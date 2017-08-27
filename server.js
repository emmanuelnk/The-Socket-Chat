var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var moment = require('moment');
var now = moment().utc();
app.use(express.static(__dirname + "/public"));

var clientInfo = {};

// sends current users to provided socket

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === "undefined") {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) {
		var userinfo = clientInfo[socketId];
		if (info.userRoom === userinfo.userRoom) {
			users.push(userinfo.userName);
		}
	});

	socket.emit("message", {
		text: "Current users: " + users.join(", "),
		msgTime: now.format("YYYY-MM-DD hh:mm:ss"), // now.valueOf() //unix timestamp
		userName: "Server",
		userColor: "grey"
	});
}

function populateCurrentUsersList(socket,room) {
	var info = clientInfo[socket.id];
	var users = {
		userlist:[]
	};

	if (typeof info === "undefined") {
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId) {
		var userinfo = clientInfo[socketId];
		if (info.userRoom === userinfo.userRoom) {

			users.userlist.push({
				userName:userinfo.userName,
				userColor:userinfo.userColor
			});
		}
	});
	io.to(room).emit("userList", users);
}

io.on("connection", function(socket) {
	console.log("User connected via Socket.io!");

	socket.on("disconnect", function() {
		if (typeof clientInfo[socket.id] !== "undefined") {
			populateCurrentUsersList(socket,clientInfo[socket.id].userRoom);
			socket.leave(clientInfo[socket.id]);
			io.to(clientInfo[socket.id].userRoom).emit("message", {
				text: clientInfo[socket.id].userName + " left the chat room!",
				msgTime: now.format("YYYY-MM-DD hh:mm:ss"), // now.valueOf() //unix timestamp
				userName: "Server",
				userColor: "grey"
			});
			
			delete clientInfo[socket.id];
		}

	});

	socket.on("message", function(message) {
		if (message.text === "@currentUsers") {
			sendCurrentUsers(socket);
		} else {
			io.to(clientInfo[socket.id].userRoom).emit("message", message);
		}

	});

	socket.on("userJoined", function(userJoined) {
		clientInfo[socket.id] = userJoined;
		console.log(userJoined.joinTime + ": " + userJoined.userName + " just joined " + userJoined.userRoom + " chat room!");
		socket.join(userJoined.userRoom);
		socket.broadcast.to(userJoined.userRoom).emit("userJoined", userJoined); // everybody including sender
		sendCurrentUsers(socket);
		populateCurrentUsersList(socket,userJoined.userRoom);
	});

	socket.emit("message", {
		text: "Welcome to the Chat App!",
		msgTime: now.format(), // now.valueOf() //unix timestamp
		userName: "Server",
		userColor: "grey"
	});
});

http.listen(PORT, function() {
	console.log("Server started at port:" + PORT + "!");
});