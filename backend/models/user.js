import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
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
  defaultAddress: String,
  specialInstructions: String,
  preferredPaymentMethod: { type: String, enum: ['Google Pay', 'Apple Pay', 'Cash on Delivery', 'Credit/Debit Card'], default: 'Cash on Delivery' },
  password: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to keep defaultAddress in sync with addresses array
userSchema.pre('save', function(next) {
  if (this.addresses && this.addresses.length > 0) {
    const def = this.addresses.find(a => a.isDefault);
    if (def) {
      this.defaultAddress = [def.street, def.city, def.state, def.postalCode].filter(Boolean).join(', ');
    }
  }
  next();
});

export default mongoose.model('User', userSchema); 