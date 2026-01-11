import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import transporter from "../config/nodemailer.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { userEmail, items, shippingAddress } = req.body;

        if (!userEmail || !items || items.length === 0) {
            return res.json({ message: 'Missing required fields: userEmail and items.' });
        }

        const productIds = items.map(item => item.product);

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.json({ message: 'One or more products not found.' });
        }

        const finalItems = products.map(product => {
            const requestedQuantity = items.find(i => i.product.toString() === product._id.toString()).quantity || 0;
            return {
                product: product._id,
                quantity: requestedQuantity,
                priceAtPurchase: product.price,
            };
        });

        const totalAmount = finalItems.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);

        const newOrder = new Order({
            userEmail,
            items: finalItems,
            shippingAddress,
            totalAmount,
            status: 'Pending',
        });

        const savedOrder = await newOrder.save();

        await savedOrder.populate('items.product', 'name price mediaRef');

        res.json(savedOrder);

    } catch (error) {
        res.json({ message: 'Error creating order.', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('items.product', 'name price mediaRef')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.json({ message: 'Error fetching orders.', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name price mediaRef');

        if (!order) {
            return res.json({ message: 'Order not found.' });
        }

        res.json(order);
    } catch (error) {
        res.json({ message: 'Error fetching order.', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.json({ message: 'Status field is required for update.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('items.product', 'name price mediaRef');

        if (!updatedOrder) {
            return res.json({ message: 'Order not found for update.' });
        }

        const email = updatedOrder.userEmail;
        const rawName = email.split("@")[0];
        const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Your order has been ${updatedOrder.status}`,
            text: `Hello ${userName},

    Your order status has been updated to: ${updatedOrder.status}.

    Thank you for using our food ordering service!`
        });


        res.json(updatedOrder);
    } catch (error) {
        res.json({ message: 'Error updating order.', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.json({ message: 'Order not found for deletion.' });
        }

        res.json({ message: 'Order successfully deleted.', order: deletedOrder });
    } catch (error) {
        res.json({ message: 'Error deleting order.', error: error.message });
    }
});

export default router;
