import mongoose from 'mongoose';
import Product from './models/product.model.js';
import connectToDatabase from './database/mongodb.js';
import fs from 'fs';

// Load each product group
const loadProducts = () => {
    const food = JSON.parse(fs.readFileSync('./scraper/food-products.json', 'utf-8'));
    const flowers = JSON.parse(fs.readFileSync('./scraper/flowers-products.json', 'utf-8'));
    const beverages = JSON.parse(fs.readFileSync('./scraper/beverages-products.json', 'utf-8'));
    const cleaning = JSON.parse(fs.readFileSync('./scraper/cleaning-products.json', 'utf-8'));


  return [...food, ...flowers, ...beverages, ...cleaning];
};

const seed = async () => {
  try {
    await connectToDatabase();

    const products = loadProducts();
    console.log(`📦 Loaded ${products.length} total products`);

    await Product.deleteMany(); // Optional: clear existing products
    await Product.insertMany(products);

    console.log('🌱 Seeded products into MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
