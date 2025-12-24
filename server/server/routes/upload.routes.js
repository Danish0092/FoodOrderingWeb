import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import Media from '../models/Media.js';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, '..', 'public', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const fileExtension = path.extname(file.originalname);
        cb(null, 'file-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, etc.) are allowed!'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } 
}).single('file'); 


router.post('/', (req, res, next) => {
    upload(req, res, async (err) => {
        
        if (err instanceof multer.MulterError) {
            return res.json({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.json({ message: err.message || 'An unknown file upload error occurred.' });
        }

        if (!req.file) {
            return res.json({ message: 'No file was selected or uploaded.' });
        }

        const uploadedFile = req.file;

        try {
            const newMedia = new Media({
                originalName: uploadedFile.originalname,
                fileName: uploadedFile.filename,
                filePath: `/uploads/${uploadedFile.filename}`, 
                mimeType: uploadedFile.mimetype,
                size: uploadedFile.size,
            });

            const savedMedia = await newMedia.save();
            
            res.json({ 
                message: 'File uploaded and metadata saved successfully.',
                media: savedMedia 
            });

        } catch (dbError) {
            try {
                await fs.unlink(uploadedFile.path); 
            } catch (cleanupError) {
                console.error(`Failed to clean up file after DB error: ${uploadedFile.path}`, cleanupError);
            }
            
            res.json({ 
                message: 'File uploaded, but failed to save metadata to database.',
                error: dbError.message 
            });
        }
    });
});

export default router;