import Product from "../models/product.model.js";
import Fuse from 'fuse.js';

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
export const getProductWithName = async (req, res) => {
  try {
    const name = req.params.name;
    const product = await Product.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { query, category } = req.query;
    if (!query) return res.status(400).json({ error: 'Missing search query' });

    const filter = category ? { category } : {};
    const data = await Product.find(filter);

    const fuse = new Fuse(data, {
      keys: ['name'],
      threshold: 0.4
    });

    const results = fuse.search(query);
    const matched = results.map(r => r.item);

    res.json(matched);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
};