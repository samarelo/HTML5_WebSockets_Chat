/* Configuration Variables */
var _HOST_ = "0.0.0.0";
var _PORT_ = 8000;
/**************************/

// import ws library / framework
var WebSocketServer = require('ws').Server
// create websocket server
var wss = new WebSocketServer({host:_HOST_,port:_PORT_});
var clients_ws =[];  //keep track of open ws sockets
var clients_name =[];//keep track of connected clients(stores usernames)


wss.on('connection', function(ws){
	console.log('connection made');
	//add client ws socket to active list
	clients_ws.push(ws);
	var username;//holds client's username (uid)
	console.log("number of ws:"+clients_ws.length);
	// Welcome the user (connection ack)
	ws.send('{"type":"ws-message","data":"Welcome"}');
	
	/* Refer to READEME.md for different types of messages
		messages are sent as JSON.stringfy
	*/
	ws.on('message', function(JSONmessage){
		//convert message to JSON Object
		var jsO=JSON.parse(JSONmessage);
		console.log(jsO);
		//determine type of message
		switch(jsO.type){
			case "hello":// client connected
				var tmpname = jsO.client;
				//is username taken?
				if (clients_name.indexOf(tmpname)>=0){
					console.log(tmpname+" is already taken::"+clients_name);
					var msgJSON={
						type:"ws-message",
						data:'Username "'+tmpname+'" is taken'};
					//notify that username is taken
					ws.send(JSON.stringify(msgJSON));
					//ask user to close connection
					var msgJSON={type:"goodbye"};
					ws.send(JSON.stringify(msgJSON));
					// client will close socket
				} else {
					//is anyone else onlien?
					if (clients_name.length>0) ws.send('{"type":"ws-message","data":"These users are online: '+clients_name+'"}');
					username = tmpname;
					//add client to active list
					clients_name.push(username);
					console.log("number of clients:"+clients_name.length);
				}
				break; 
			case "message":	// relay message
				//relay message to everyone
				for (var i=0;i<clients_ws.length;i++) clients_ws[i].send(JSONmessage);
				break;
		}
	});

	ws.on('close', function(){
		//remove ws from active list
		var i = clients_ws.indexOf(ws);
		clients_ws.splice(i,1);
		// check if usnerame was accepted		
		if (username){
			// remove client from active list
			var j = clients_name.indexOf(username);
			clients_name.splice(j,1);
			console.log("'"+username+"' dropped => number of clients:"+clients_name.length);
		}		
		console.log("number of ws:"+clients_ws.length);
	});
});
