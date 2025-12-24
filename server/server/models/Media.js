import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
    {
        originalName: {
            type: String,
            required: [true, 'Original file name is required'],
        },
        fileName: {
            type: String,
            required: [true, 'Generated file name is required'],
            unique: true,
        },
        filePath: {
            type: String, 
            required: [true, 'File path is required'],
            unique: true,
        },
        mimeType: {
            type: String,
            required: [true, 'MIME type is required'],
        },
        size: {
            type: Number,
            required: [true, 'File size is required'],
        },
    },
    {
        timestamps: true,
        collection: 'media',
    }
);

const Media = mongoose.model('Media', MediaSchema);
export default Media;