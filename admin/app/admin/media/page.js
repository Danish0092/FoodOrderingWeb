'use client';

import { useEffect, useState } from 'react';
import { mediaAPI, uploadAPI } from '@/app/lib/api';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Upload, Trash2, Edit } from 'lucide-react';

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const data = await mediaAPI.getAll();
      setMediaFiles(data);
    } catch (error) {
      showAlert('error', 'Failed to fetch media: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      await uploadAPI.uploadFile(file);
      showAlert('success', 'File uploaded successfully');
      fetchMedia();
      setModalOpen(false);
    } catch (error) {
      showAlert('error', 'Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    setEditName(media.originalName);
    setEditModalOpen(true);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await mediaAPI.update(selectedMedia._id, { originalName: editName });
      showAlert('success', 'Media name updated successfully');
      fetchMedia();
      setEditModalOpen(false);
    } catch (error) {
      showAlert('error', 'Failed to update: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media file? This action cannot be undone.')) return;

    try {
      await mediaAPI.delete(id);
      showAlert('success', 'Media deleted successfully');
      fetchMedia();
    } catch (error) {
      showAlert('error', 'Failed to delete media: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Upload size={20} className="inline mr-2" />
          Upload Image
        </Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {mediaFiles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Upload className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No media files yet</h3>
          <p className="text-gray-500 mb-4">Upload your first image to get started</p>
          <Button onClick={() => setModalOpen(true)}>Upload Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaFiles.map((media) => (
            <div key={media._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${media.filePath}`}
                  alt={media.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm truncate mb-1" title={media.originalName}>
                  {media.originalName}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {formatFileSize(media.size)} • {new Date(media.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(media)}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(media._id)}
                    className="flex-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Image"
      >
        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <Upload className="text-gray-400 mb-4" size={48} />
              <p className="text-lg text-gray-600 mb-2">
                {uploading ? 'Uploading...' : 'Click to select an image'}
              </p>
              <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Media"
      >
        {selectedMedia && (
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${selectedMedia.filePath}`}
                alt={selectedMedia.originalName}
                className="w-full max-h-64 object-contain rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Size:</strong> {formatFileSize(selectedMedia.size)}
              </div>
              <div>
                <strong>Type:</strong> {selectedMedia.mimeType}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
