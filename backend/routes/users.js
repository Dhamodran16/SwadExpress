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
    // If no defaultAddress but has addresses, set the first as default
    if (!user.defaultAddress && user.addresses && user.addresses.length > 0) {
      const first = user.addresses[0];
      user.defaultAddress = [first.street, first.city, first.state, first.postalCode].filter(Boolean).join(', ');
      await user.save();
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
    const { addresses } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { $set: { addresses } },
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
    // If the new/edited address is marked as default, update defaultAddress
    if (address && address.isDefault) {
      user.defaultAddress = [address.street, address.city, address.state, address.postalCode].filter(Boolean).join(', ');
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
    if (!user) throw new Error('User not found');
    if (user.password && user.password !== currentPassword) {
      throw new Error('Current password does not match');
    }
    // If user.password is null, allow setting new password without checking currentPassword
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/firebase/:firebaseUid', async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // This will include addresses as an array of objects
  } catch (err) {
    next(err);
  }
});

const isProfileComplete = () => {
  if (!profileData) return false;
  return REQUIRED_FIELDS.every(field => typeof profileData[field] === 'string' && profileData[field].trim() !== '');
};

export default router; 