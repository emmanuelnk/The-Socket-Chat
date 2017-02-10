var socket = io();
var now = moment();

socket.on("connect", function (){
	console.log("Connected to socket.io console!");
});

socket.on("message", function (message) {
//convert time from UTC to local timezone using local()
var timestamp = moment.parseZone(message.msgTime).local().format("Do-MMM-YYYY h:mma");
$(".messages").append("<p><b>" + timestamp +"</b>: " + message.text + "</p>");

});


// submit new message

$("#message-form").on("submit", function (event) {
	event.preventDefault();
	socket.emit("message", {
		text:$("#message-form").find("input[name=message ]").val(),
		msgTime:now.utc().format() //send UTC time to server
	});

	$("#message-form").find("input[name=message ]").val("").focus();

});