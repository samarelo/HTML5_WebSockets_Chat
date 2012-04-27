server.js

Uses: 
	node.js	http://nodejs.org
	ws	http://einaros.github.com/ws/


messages sent to/from socket are in JSON.stringfy form


Messages that can be recevied by server.js
Message sent between clients
{
	type:"message",
	client:<username of client that sent message>,
	data:<message>
}

Message sent from client on initial connection
{
	type:"hello",
	client:<username of client connecting to server>
}

Message sent from client when disconnecting
{
	type:"goodbye",
	client:<username of client disconnecting>
}
	

Messages that can be sent by server.js
Message relayed by server

{

	type:"message",
	client:<username of client that sent message>,
	datat:<message>

}

Message stating clients currently online. 
Broadcasted when a client connects/disconnects

{

	type:"whoisonline",
	data:<array of client usernames>

}

Informative message sent by server

{
	type:"ws-message",
	data:<message sent from server>

}
