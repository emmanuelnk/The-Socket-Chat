var socket = io();
var now = moment();

var userName = getQueryVariable("name") || "Anonymous";
var userRoom = getQueryVariable("room") || "Anonymous";
var randColor = getRandomColor();
var lastMessageSentTime;

socket.on("connect", function() {
	console.log("Connected to socket.io console!");
	socket.emit("userJoined", {
		joinTime: now.utc().format(), //send UTC time to server
		userName: userName,
		userColor: randColor,
		userRoom: userRoom
	});

	lastMessageSentTime = parseInt(now.utc().format('x'));
	var firstTimestamp = moment().parseZone(now.format()).local().format("Do-MMM-YYYY h:mm a");
	$(".messages").append("<p style=\"text-align:center;color: grey;\"><b>" + firstTimestamp + "</b></p>");
	console.log(lastMessageSentTime);
});

socket.on("message", function(message) {
	//convert time from UTC to local timezone using local()
	if (parseInt(moment().parseZone(message.msgTime).utc().format("x")) - lastMessageSentTime > 120000) {
		var fullTimestamp = moment().parseZone(message.msgTime).local().format("Do-MMM-YYYY h:mm a");
		$(".messages").append("<p style=\"text-align:center;color:grey;\"><b>" + fullTimestamp + "</b></p>");
	}

	var smallTimestamp = moment().parseZone(message.msgTime).local().format("h:mm:ss a");
	console.log(smallTimestamp);
	$(".messages").append("<p><b style=\"color:grey;\">" + smallTimestamp + "</b><b><span style=\"color:" + message.userColor + ";\" > [" + message.userName + "]</span>:</b>" + message.text + "</p>");

	lastMessageSentTime = moment().parseZone(message.msgTime).utc().format('x');
});

socket.on("userJoined", function(userJoined) {
	//convert time from UTC to local timezone using local()
	var timestamp = moment.parseZone(userJoined.joinTime).local().format("Do-MMM-YYYY h:mm:ss a");
	$(".messages").append("<p style=\"color:" + userJoined.userColor + ";\">" + userJoined.userName + " just joined the <b>" + userJoined.userRoom + "</b> chat!</p>");

});

socket.on("userList", function(users) {
	var list = users.userlist;
	$("#currentUsers").empty();
	$("#currentUsers").append("<h4><b>users:</b></h4>");
	list.forEach(function (el) {
		$("#currentUsers").append("<p style=\"color:" + el.userColor + ";\">" + el.userName + "</p>");
	});
});

$("#room-title").text("chatroom: " + userRoom);
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
	var lettersBright = '456789ABCDEF';

	var color = '#';

	var count = 0;
	switch (count) {
		case 0:
			color += lettersBright[Math.floor(Math.random() * 12)];
		case 1:
			color += letters[Math.floor(Math.random() * 16)];
		case 2:
			color += lettersBright[Math.floor(Math.random() * 12)];
		case 3:
			color += letters[Math.floor(Math.random() * 16)];
		case 4:
			color += lettersBright[Math.floor(Math.random() * 12)];
		case 5:
			color += letters[Math.floor(Math.random() * 16)];
			break;
	}
	return color;
}