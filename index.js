var express = require('express');
var app = express();
var path = require('path');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port', 3000 );
app.use(express.static(path.join(__dirname, 'public')));

var clients = [];

var version = "27-03-2017-0000001";

io.on("connection", function(socket)
{
	var currentUser;
	var playerspeed = 4.0;
	var deltatime = 0.03

	var time;
	var deltatime;

	var debugIndex = 0;

	socket.on("USER_CONNECT",function()
	{
		console.log("User connected");

		currentUser = 
		{
			name: data.name,
			position: data.position,
			input: data.input
		}
		clients.push(currentUser);
		console.log("User: "+currentUser.name+ " is connected! There are now "+clients.length+" Users online!");

		socket.emit("PLAY", currentUser);
		socket.broadcast.emit("USER_CONNECTED",currentUser);
		/*
		for( var i = 0 ; i < clients.length ; i++ )
		{
			socket.emit("USER_CONNECTED", { name:clients[i].name , position:clients[i].position });
			console.log("User: "+clients[i].name+ " is connected! There are now "+clients.length+" Users online!");
		}
		*/
	 });

	socket.on("PLAY", function( data )
	{
		
	});

	socket.on("MOVE", function( data ) 
	{
			//console.log("[DEBUG][0]"+currentUser.name+" currentUser.position: "+currentUser.position);
			//console.log("[DEBUG][1]"+currentUser.name+" data.movdir: "+data.movdir);
			var pos = currentUser.position.replace("(", '').replace(")", '').split(",");
			console.log("[DEBUG "+debugIndex+"][2]"+currentUser.name+" pos: "+pos); debugIndex++;

			//console.log("[DEBUG][1] data.movdir: "+data.movdir);
			var input = data.input.slice(1, -1);
			//console.log("[DEBUG][2] input: "+input);
			var dir = input.split(",");
			console.log("[DEBUG "+debugIndex+"][3] dir: "+dir);debugIndex++;
			//console.log(currentUser.name+" movdir "+data.movdir+" * playerspeed:"+playerspeed);
			console.log("[DEBUG "+debugIndex+"][3.1] dir[0]: "+dir[0]);debugIndex++;
			console.log("[DEBUG "+debugIndex+"][3.2] parseFloat(dir[0]):"+parseFloat(dir[0]));debugIndex++;
			console.log("[DEBUG "+debugIndex+"][3.3] parseFloat(pos[0]):"+parseFloat(pos[0]));debugIndex++;
			var x = parseFloat(pos[0]) + ((parseFloat(dir[0]) * playerspeed * deltatime));
			var y = parseFloat(pos[1]) + ((parseFloat(dir[1]) * playerspeed * deltatime));
			var z = parseFloat(pos[2]) + ((parseFloat(dir[2]) * playerspeed * deltatime));
			var newPos = x +","+ y +","+ z;
			console.log("[DEBUG "+debugIndex+"][4]"+currentUser.name+" newPos: "+newPos);debugIndex++;
			currentUser.position = newPos;
			//console.log("[MOVE]"+currentUser.name+" to: "+currentUser.position);
	});

	socket.on("disconnect", function()
	{
		socket.broadcast.emit("USER_DISCONNECTED", currentUser );
		console.log("a user disconnected! There are now "+clients.length+" Users online!");

		for( var i = 0 ; i < clients.length ; i++ )
		{
			if( clients[i].name === currentUser.name)
			{
				var clientName = clients[i].name;
				clients.splice(i,1);
				console.log("User: "+clientName+ " disconnected! There are now "+clients.length+" Users online!");
			}
		};
	});

	function mainLoop()
	{
		for( var i = 0 ; i < clients.length ; i++ )
		{
			socket.emit("MOVE",clients[i]);
		}
	}
	setInterval( mainLoop , 16);

});

server.listen(app.get('port'), function ()
{
	console.log("-----------SERVER RUNNING - Version:"+version+"----------");
});
