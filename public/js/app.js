var socket = io();
socket.on("connect", function (){
	console.log("Connected to socket.io console!");
});

socket.on("message", function (message) {
console.log("Message:")	
console.log(message.text);
console.log("Message Time:")	
console.log(message.msgTime);

});