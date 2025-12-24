import mongoose from 'mongoose';

// Define the schema for the OrderItem sub-document
const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    priceAtPurchase: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: false });

// Define the schema for the Order model
const OrderSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: [true, 'User email is required for the order'],
            trim: true,
        },
        items: {
            type: [OrderItemSchema],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: 0,
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
        },
    },
    {
        timestamps: true,
        collection: 'orders',
    }
);

const Order = mongoose.model('Order', OrderSchema);
export default Order;