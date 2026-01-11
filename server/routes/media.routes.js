import { Router } from 'express';
import Media from '../models/Media.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', async (req, res) => {
    try {
        const mediaRecords = await Media.find().sort({ createdAt: -1 });
        res.json(mediaRecords);
    } catch (error) {
        res.json({ message: 'Error fetching media records.', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        
        if (!media) {
            return res.json({ message: 'Media record not found.' });
        }
        
        res.json(media);
    } catch (error) {
        res.json({ message: 'Error fetching media record.', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { originalName } = req.body;
        
        if (!originalName) {
            return res.json({ message: 'Original name is required for update.' });
        }

        const updatedMedia = await Media.findByIdAndUpdate(
            req.params.id,
            { originalName },
            { new: true, runValidators: true }
        );

        if (!updatedMedia) {
            return res.json({ message: 'Media record not found for update.' });
        }
        
        res.json(updatedMedia);
    } catch (error) {
        res.json({ message: 'Error updating media record.', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedMedia = await Media.findByIdAndDelete(req.params.id);

        if (!deletedMedia) {
            return res.json({ message: 'Media record not found for deletion.' });
        }

        const absoluteFilePath = path.join(__dirname, '..', 'public', 'uploads', deletedMedia.fileName);
        
        try {
            await fs.access(absoluteFilePath); 
            await fs.unlink(absoluteFilePath);
            console.log(`Successfully deleted file: ${absoluteFilePath}`);
        } catch (fileError) {
            console.warn(`File not found on disk or error deleting: ${absoluteFilePath}. DB record was deleted.`);
        }
        
        res.json({ message: 'Media record and associated file successfully deleted.', media: deletedMedia });
    } catch (error) {
        res.json({ message: 'Error deleting media record and file.', error: error.message });
    }
});


export default router;