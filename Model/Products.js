import mongoose from "mongoose";

const Product = new mongoose.Schema({
    userId: String,
    title: String,
    images: Array,
    description: String,
    price: Number,
    brand: String,
    category: String,
    thumbnail: String,
});

const ProductModel = mongoose.models.Products || mongoose.model('Products', Product);

export default ProductModel;