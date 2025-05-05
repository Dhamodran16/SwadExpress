import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dhamodran17:WT_PROJECT@wt-project.zr3ux3r.mongodb.net/?retryWrites=true&w=majority&appName=WT-PROJECT';

const restaurants = [
  {
    name: 'Spice Paradise',
    cuisine: 'Indian',
    rating: 4.5,
    deliveryTime: '30-45 min',
    minOrder: 200,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    address: {
      street: '123 Main Street',
      city: 'Erode',
      state: 'Tamil Nadu',
      zipCode: '638052'
    }
  },
  // ... other restaurants ...
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Insert restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log('Added new restaurants');

    // Add restaurant IDs to menu items (3 items per restaurant)
    const menuItemsWithRestaurantIds = menuItems.map((item, index) => ({
      ...item,
      restaurantId: insertedRestaurants[Math.floor(index / 3)]._id
    }));

    // Insert menu items
    await MenuItem.insertMany(menuItemsWithRestaurantIds);
    console.log('Added new menu items');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedData();