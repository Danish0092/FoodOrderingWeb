import { Router } from 'express';
import Category from '../models/Category.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.json({ message: 'Category name is required.' });
        }

        const newCategory = new Category({ name, description });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ message: 'Category name already exists.' });
        }
        res.json({ message: 'Error creating category.', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.json({ message: 'Error fetching categories.', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.json({ message: 'Category not found.' });
        }
        
        res.json(category);
    } catch (error) {
        res.json({ message: 'Error fetching category.', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.json({ message: 'Category not found for update.' });
        }
        
        res.json(updatedCategory);
    } catch (error) {
        res.json({ message: 'Error updating category.', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.json({ message: 'Category not found for deletion.' });
        }

        res.json({ message: 'Category successfully deleted.', category: deletedCategory });
    } catch (error) {
        res.json({ message: 'Error deleting category.', error: error.message });
    }
});

export default router;