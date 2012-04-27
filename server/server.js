var _HOST_ = "0.0.0.0";
var _PORT_ = 8000;


var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({host:_HOST_,port:_PORT_});
var clients_ws =[];
var clients_name =[];

/* All sent/received messages should be sent in JSON string form

Received Message Form
JSON message is defined as follows
	type	Type of message
		"hello" = connection made
		"goodbye" = connection close
		"message" = message
	
	client	UID of client that sent data
	
	data	(optional) actual message 



Sent Message Form
	type
		"message" = message 
		"ws-message" = message from server
	sender	who sent the message  	

	data	actual message	
*/

wss.on('connection', function(ws){
	console.log('connection made');
	//add client to active list
	clients_ws.push(ws);
	var username;
	console.log("number of ws:"+clients_ws.length);
	ws.send('{"type":"ws-message","data":"Welcome"}');

	ws.on('message', function(JSONmessage){

		var jsO=JSON.parse(JSONmessage);
		console.log(jsO);
		switch(jsO.type){
			case "hello":	console.log("hello "+jsO.client);
					// update client's array
					username=jsO.client;
					if (clients_name.length>0) ws.send('{"type":"ws-message","data":"These users are online: '+clients_name+'"}');
					clients_name.push(username);
					break; 
			case "message":	console.log(jsO.client+" sent=> "+jsO.data);
					for (var i=0;i<clients_ws.length;i++) clients_ws[i].send(JSONmessage);
					break;
		}
	});

	ws.on('close', function(){
		var i = clients_ws.indexOf(ws);
		clients_ws.splice(i,1);

		if (username){
			var j = clients_name.indexOf(username);
			 clients_name.splice(j,1);
		}		
		console.log(clients_name);
		console.log(username+" disconnected");
//		console.log("number of clients:"+clients_name.length);
		console.log("number of ws:"+clients_ws.length);
	});

});
