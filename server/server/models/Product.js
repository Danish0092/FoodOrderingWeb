import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product must belong to a category'],
        },
        mediaRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media', // Reference to the Media model
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'products',
    }
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;