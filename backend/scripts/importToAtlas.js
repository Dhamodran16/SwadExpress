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

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://dhamodran17:WT_PROJECT@wt-project.zr3ux3r.mongodb.net/?retryWrites=true&w=majority&appName=WT-PROJECT';

async function importToAtlas() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const dataDir = path.join(__dirname, 'data');

    // Import Restaurants
    const restaurantsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'restaurants.json')));
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(restaurantsData);
    console.log('Imported restaurants');

    // Import MenuItems
    const menuItemsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'menuItems.json')));
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItemsData);
    console.log('Imported menu items');

    // Import Orders
    const ordersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json')));
    await Order.deleteMany({});
    await Order.insertMany(ordersData);
    console.log('Imported orders');

    // Import Users
    const usersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json')));
    await User.deleteMany({});
    await User.insertMany(usersData);
    console.log('Imported users');

    console.log('Data import to Atlas completed successfully');
  } catch (error) {
    console.error('Error importing data to Atlas:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

// Run the import function
importToAtlas(); 