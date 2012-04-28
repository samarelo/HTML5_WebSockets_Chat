var _HOST_ = "0.0.0.0";
var _PORT_ = 8000;


var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({host:_HOST_,port:_PORT_});
var clients_ws =[];
var clients_name =[];

wss.on('connection', function(ws){
	console.log('connection made');
	//add client ws socket to active list
	clients_ws.push(ws);
	var username;
	console.log("number of ws:"+clients_ws.length);
	ws.send('{"type":"ws-message","data":"Welcome"}');

	ws.on('message', function(JSONmessage){
		var jsO=JSON.parse(JSONmessage);
		console.log(jsO);
		switch(jsO.type){
			case "hello":	// client connected
				// update client's array
				var tmpname = jsO.client;
				if (clients_name.indexOf(tmpname)>=0){
					console.log(tmpname+" is already taken::"+clients_name);
					var msgJSON={
						type:"ws-message",
						data:'Username "'+tmpname+'" is taken'};
					ws.send(JSON.stringify(msgJSON));
					var msgJSON={type:"goodbye"};
					ws.send(JSON.stringify(msgJSON));
					// client will close socket
				} else {
					if (clients_name.length>0) ws.send('{"type":"ws-message","data":"These users are online: '+clients_name+'"}');
					username = tmpname;
					clients_name.push(username);
					console.log("number of clients:"+clients_name.length);
				}
				break; 
			case "message":	// relay message
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
			console.log("'"+username+"' dropped => number of clients:"+clients_name.length);
		}		
		console.log("number of ws:"+clients_ws.length);
	});

});
