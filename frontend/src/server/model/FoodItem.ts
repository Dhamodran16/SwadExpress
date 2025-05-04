import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
});

export default mongoose.model('FoodItem', FoodItemSchema);
