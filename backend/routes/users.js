import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Get user profile by firebaseUid
router.get('/:firebaseUid', async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Create user profile
router.post('/', async (req, res, next) => {
  try {
    const user = new User(req.body);
    user.preferredPaymentMethod = 'Cash on Delivery'; // or another valid value
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.patch('/:firebaseUid', async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Delete user profile
router.delete('/:firebaseUid', async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

// Add or update address
router.patch('/:firebaseUid/address', async (req, res, next) => {
  try {
    const { address, addressId } = req.body;
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    if (addressId) {
      // Edit existing address
      user.addresses = user.addresses.map(a => a._id.toString() === addressId ? { ...a.toObject(), ...address } : a);
    } else {
      // Add new address
      user.addresses.push(address);
    }
    user.updatedAt = new Date();
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Delete address
router.delete('/:firebaseUid/address/:addressId', async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    user.updatedAt = new Date();
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Change user password
router.patch('/:firebaseUid/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    if ((user.password || '') !== (currentPassword || '')) {
      const error = new Error('Current password does not match');
      error.status = 400;
      throw error;
    }
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

const isProfileComplete = () => {
  if (!profileData) return false;
  return REQUIRED_FIELDS.every(field => typeof profileData[field] === 'string' && profileData[field].trim() !== '');
};

export default router; 