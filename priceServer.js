/*

var http = require('http'); 

var server = http.createServer(function(request,response){ 

    response.writeHead(200,{'Content-Type':'text/html'});
    response.end("abc");

});

server.listen(8080, function(){ 
    console.log('Server is running...');
});


*/
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var result;

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = 8080;

app.use("/script",express.static(__dirname + "/script"))

var server = app.listen(PORT,function(){
	console.log("start in " + PORT + " port ");
});

app.get('/',function(request,response){
	response.sendFile('priceHome.html', { root: '.' })
});

io.listen(server);

io.on('connection',function(socket){
	console.log('user Connected');
	socket.on('chat message', function(msg){
		console.log("message : " + msg);
	})

	socket.on('disconnect',function(){
		console.log("user disconnect");	
	})
});

app.post('/getPriceData',function(request,response){

	MongoClient.connect(url,function(err,db){
	if(err) throw err;
	
	var dbo = db.db("price");

		dbo.collection("price").find().toArray(function(err,databaseResult){
			if (err) throw err;
	//	    console.log(databaseResult);
		    result = databaseResult;
		    db.close();
		})
	})
	//	    console.log(result);
	response.json(result);
})