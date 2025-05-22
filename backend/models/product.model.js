import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    section: String,
    url: String,
    imageUrl: String,
    imagePath: String,
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
