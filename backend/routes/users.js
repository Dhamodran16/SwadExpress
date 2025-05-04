import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Get user profile by firebaseUid
router.get('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user profile
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    user.preferredPaymentMethod = 'Cash on Delivery'; // or another valid value
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user profile
router.patch('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user profile
router.delete('/:firebaseUid', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update address
router.patch('/:firebaseUid/address', async (req, res) => {
  try {
    const { address, addressId } = req.body;
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
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
    res.status(400).json({ error: err.message });
  }
});

// Delete address
router.delete('/:firebaseUid/address/:addressId', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    user.updatedAt = new Date();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Change user password
router.patch('/:firebaseUid/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if ((user.password || '') !== (currentPassword || '')) {
      return res.status(400).json({ error: 'Current password does not match' });
    }
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const isProfileComplete = () => {
  if (!profileData) return false;
  return REQUIRED_FIELDS.every(field => typeof profileData[field] === 'string' && profileData[field].trim() !== '');
};

export default router; 