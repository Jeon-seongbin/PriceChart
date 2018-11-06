const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/price',function (err){
  if(err) throw err;
});
var Schema = mongoose.Schema;

var priceSchema = new Schema({
  _id : Schema.Types.ObjectId,
  price : Number,
  time : String,
  exchange : String
}, { collection: 'price' });
mongoose.model('price',priceSchema);