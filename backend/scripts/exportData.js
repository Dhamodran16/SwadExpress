import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/order.js';
import User from '../models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dhamodran17:WT_PROJECT@wt-project.zr3ux3r.mongodb.net/?retryWrites=true&w=majority&appName=WT-PROJECT';

async function exportData() {
  try {
    // Connect to local MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to local MongoDB');

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Export Restaurants
    const restaurants = await Restaurant.find({});
    fs.writeFileSync(
      path.join(dataDir, 'restaurants.json'),
      JSON.stringify(restaurants, null, 2)
    );
    console.log('Exported restaurants');

    // Export MenuItems
    const menuItems = await MenuItem.find({});
    fs.writeFileSync(
      path.join(dataDir, 'menuItems.json'),
      JSON.stringify(menuItems, null, 2)
    );
    console.log('Exported menu items');

    // Export Orders
    const orders = await Order.find({});
    fs.writeFileSync(
      path.join(dataDir, 'orders.json'),
      JSON.stringify(orders, null, 2)
    );
    console.log('Exported orders');

    // Export Users
    const users = await User.find({});
    fs.writeFileSync(
      path.join(dataDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log('Exported users');

    console.log('Data export completed successfully');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the export function
exportData();