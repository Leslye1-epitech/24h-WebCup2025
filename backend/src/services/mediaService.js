// services/mediaService.js
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class MediaService {
    /**
     * Save a file to the uploads directory
     * @param {Buffer} fileBuffer - The file buffer
     * @param {String} fileName - Original file name
     * @returns {Promise<String>} - The saved file path
     */
    static async saveFile(fileBuffer, fileName) {
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${fileName.replace(/\s/g, '-')}`;
        const filePath = path.join(config.uploadDir, uniqueName);

        // Ensure directory exists
        if (!fs.existsSync(config.uploadDir)) {
            fs.mkdirSync(config.uploadDir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, fileBuffer, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`/uploads/${uniqueName}`);
                }
            });
        });
    }

    /**
     * Delete a file from the uploads directory
     * @param {String} fileUrl - The file URL
     * @returns {Promise<Boolean>} - Success status
     */
    static async deleteFile(fileUrl) {
        try {
            // Extract filename from URL
            const fileName = fileUrl.split('/').pop();
            const filePath = path.join(config.uploadDir, fileName);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return false;
            }

            // Delete file
            fs.unlinkSync(filePath);
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    /**
     * Determine the media type based on file extension
     * @param {String} fileName - The file name
     * @returns {String} - The media type
     */
    static getMediaType(fileName) {
        const ext = path.extname(fileName).toLowerCase();

        // Image formats
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
            return 'image';
        }

        // Audio formats
        if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
            return 'audio';
        }

        // Video formats
        if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) {
            return 'video';
        }

        // Default to image
        return 'image';
    }

    /**
     * Validate a file before upload
     * @param {Object} file - The file object
     * @returns {Object} - Validation result
     */
    static validateFile(file) {
        // Check file size
        if (file.size > config.maxFileSize) {
            return {
                valid: false,
                error: `File size exceeds maximum limit of ${config.maxFileSize / (1024 * 1024)}MB`
            };
        }

        // Check file type by extension
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', // Images
            '.mp3', '.wav', '.ogg', '.m4a',                  // Audio
            '.mp4', '.webm', '.mov', '.avi'                  // Video
        ];

        if (!allowedExtensions.includes(ext)) {
            return {
                valid: false,
                error: 'File type not allowed. Only images, audio, and video files are permitted.'
            };
        }

        return { valid: true };
    }
}

module.exports = MediaService;