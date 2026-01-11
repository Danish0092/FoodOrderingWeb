import { Router } from 'express';
import Product from '../models/Product.js';
import Media from '../models/Media.js';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productPopulation = (query) => {
    return query
        .populate('category', 'name description')
        .populate('mediaRef'); 
};





router.post('/', async (req, res) => {
    try {
        const productData = req.body;

        if (!productData.name || !productData.price || !productData.category) {
            return res.json({ message: 'Missing required fields: name, price, and category.' });
        }

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        const populatedProduct = await productPopulation(savedProduct.populate());
        
        res.json(populatedProduct);
    } catch (error) {
        res.json({ message: 'Error creating product.', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const productQuery = Product.find().sort({ name: 1 });
        const products = await productPopulation(productQuery);

        res.json(products);
    } catch (error) {
        res.json({ message: 'Error fetching products.', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productQuery = Product.findById(req.params.id);
        const product = await productPopulation(productQuery);
        
        if (!product) {
            return res.json({ message: 'Product not found.' });
        }
        
        res.json(product);
    } catch (error) {
        res.json({ message: 'Error fetching product.', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productQuery = Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        const updatedProduct = await productPopulation(productQuery);

        if (!updatedProduct) {
            return res.json({ message: 'Product not found for update.' });
        }
        
        res.json(updatedProduct);
    } catch (error) {
        res.json({ message: 'Error updating product.', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { deleteMedia } = req.query;
        let mediaDeleted = false;
        const productToDelete = await Product.findById(req.params.id);

        if (!productToDelete) {
            return res.json({ message: 'Product not found for deletion.' });
        }

        const mediaRefId = productToDelete.mediaRef;

        if (deleteMedia === 'true' && mediaRefId) {
            const deletedMediaRecord = await Media.findByIdAndDelete(mediaRefId);

            if (deletedMediaRecord) {
                try {
                    const relativeFilePath = deletedMediaRecord.filePath.substring(1); // remove leading '/'
                    const absoluteFilePath = path.resolve(__dirname, '..', '..', relativeFilePath); 
                    
                    await fs.access(absoluteFilePath); 
                    await fs.unlink(absoluteFilePath);
                    mediaDeleted = true;
                } catch (fileError) {
                    console.warn(`Could not delete file for media ID ${mediaRefId}: ${fileError.message}`);
                }
            }
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
             return res.json({ message: 'Product not found for deletion.' });
        }

        res.json({ 
            message: 'Product permanently deleted.', 
            product: deletedProduct, 
            mediaDeleted: mediaDeleted 
        });

    } catch (error) {
        res.json({ message: 'Error deleting product.', error: error.message });
    }
});

export default router;