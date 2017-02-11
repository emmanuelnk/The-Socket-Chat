var socket = io();
var now = moment();

var userName = getQueryVariable("name") || "Anonymous";
var userRoom = getQueryVariable("room") || "Anonymous";
var randColor = getRandomColor();

socket.on("connect", function() {
	console.log("Connected to socket.io console!");
	socket.emit("userJoined", {
		joinTime: now.utc().format(), //send UTC time to server
		userName: userName,
		userColor: randColor,
		userRoom: userRoom
	});
});

socket.on("message", function(message) {
	//convert time from UTC to local timezone using local()
	var timestamp = moment.parseZone(message.msgTime).local().format("Do-MMM-YYYY h:mma");
	$(".messages").append("<p><b>" + timestamp + "<span style=\"color:" + message.userColor + ";\" > [" + message.userName + "]</span>:</b>" + message.text + "</p>");

});

socket.on("userJoined", function(userJoined) {
	//convert time from UTC to local timezone using local()
	var timestamp = moment.parseZone(userJoined.joinTime).local().format("Do-MMM-YYYY h:mma");
	$(".messages").append("<p style=\"color:" + userJoined.userColor + ";\">" + userJoined.userName + " just joined the <b>" + userJoined.userRoom + "</b> chat!</p>");

});

$("#room-title").text(userRoom);
// submit new message

$("#message-form").on("submit", function(event) {
	event.preventDefault();
	socket.emit("message", {
		text: $("#message-form").find("input[name=message ]").val(),
		msgTime: now.utc().format(), //send UTC time to server
		userName: userName,
		userColor: randColor,
		userRoom: userRoom
	});

	$("#message-form").find("input[name=message ]").val("").focus();

});

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}