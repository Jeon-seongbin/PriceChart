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
	var exchangeWhere = req.body.exchange;
	console.log(exchangeWhere)
	if(flag == 0){
		//first connection
		var query = price.find({}).where('exchange',exchangeWhere);
		query.exec(function(err, price) {
	        priceData = price;
	    	res.header("Access-Control-Allow-Origin", "*");
	        res.json(priceData);
		});
	}else if(flag == 1){
		//over first connection
		var query = price.find().where('exchange',exchangeWhere).sort({time:-1}).limit(1);
		query.exec(function(err, price) {

	        console.log(price);
	    	res.header("Access-Control-Allow-Origin", "*");
	        res.json(price);
		});
	}else{
		//when disconnected
		console.log(priceData);
		if(priceData == null){
			var query = price.find({exchangeWhere}).where('exchange',exchangeWhere);
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