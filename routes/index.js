var express = require('express');
var router = express.Router();
//import mongoose
var mongoose = require('mongoose');

var price = mongoose.model('price');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/*+json'});

var priceData = null;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/getPriceData',jsonParser, function(req,res,result){
	
	console.log(req.body.flag);

	var flag = req.body.flag;

	if(flag == 0){
		//first connection
		var query = price.find({});
		query.exec(function(err, price) {
	        priceData = price;
	    	res.header("Access-Control-Allow-Origin", "*");
	        res.json(priceData);
		});
	}else if(flag == 1){
		//over first connection

		var query = price.find({}).sort({time:-1}).limit(1);
		query.exec(function(err, price) {

	        console.log(price);
	    	res.header("Access-Control-Allow-Origin", "*");
	        res.json(price);
		});
	}else{
		console.log(priceData);
		if(priceData == null){
			var query = price.find({});
			query.exec(function(err, price) {
		        priceData = price;
		    	res.header("Access-Control-Allow-Origin", "*");
		        console.log(priceData);
		        res.json(priceData);
			});
		}
	}
});
module.exports = router;