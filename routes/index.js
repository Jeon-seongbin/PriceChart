var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const mongodbURL = 'mongodb://localhost:27017/';

var ret;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/getPriceData', function(req,res,next){
  	MongoClient.connect(mongodbURL, function (err, client) {
	  if (err){
	    throw err
	  }else{
	    console.log('mongod connected');
	  }
	  const db = client.db('price');
	  db.collection('price').find().toArray(function (err, result) {
	    if (err) throw err
		ret = result;
		client.close();
	  });
	});
    console.log(ret);
	res.json(ret);
});

module.exports = router;
