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


// submit new message

var $form = jQuery("#message-form");
$form.on("submit", function (event) {
	event.preventDefault();
	socket.emit("message", {
		text:$form.find("input[name=message ]").val(),
		msgTime:moment().format("YYYY-MM-DD hh:mm:ss")
	});
	
	$form.find("input[name=message ]").val("").focus();

});