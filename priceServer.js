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
var app= express();

app.use("/script",express.static(__dirname + "/script"))

app.listen(8080,function(){
	console.log("start");
});

app.get('/',function(request,response){
	response.sendFile('priceHome.html', { root: '.' })
});

app.post('/getPriceData',function(request,response){

	MongoClient.connect(url,function(err,db){
	if(err) throw err;
	
	var dbo = db.db("price");

		dbo.collection("price").find().toArray(function(err,databaseResult){
			if (err) throw err;
		    console.log(databaseResult);

		    result = databaseResult;


		    db.close();
		})
	})
		    console.log(result);
	response.json(result);
})