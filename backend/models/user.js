import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  landmark: String,
  contact: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  displayName: String,
  email: { type: String, required: true },
  phone: String,
  photoURL: String,
  addresses: [addressSchema],
  address: String,
  deliveryAddress: String,
  specialInstructions: String,
  preferredPaymentMethod: { type: String, enum: ['Google Pay', 'Apple Pay', 'Cash on Delivery', 'Credit/Debit Card'], default: 'Cash on Delivery' },
  password: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema); 