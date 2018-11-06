var express = require('express');
var router = express.Router();
//import mongoose
var mongoose = require('mongoose');

var price = mongoose.model('price');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/getPriceData', function(req,res,resi){

	var query = price.find({});
	query.exec(function(err, price) {
  
         // Method to construct the json result set
         console.log(price);
         res.json(price);
  
  });
});
module.exports = router;