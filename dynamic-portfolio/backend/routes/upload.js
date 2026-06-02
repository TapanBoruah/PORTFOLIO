const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');

// Configure Cloudinary SDK using Environment Settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer-Storage-Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isPdf = ext === '.pdf';
    return {
      folder: 'portfolio',
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf'],
      resource_type: isPdf ? 'raw' : 'auto', // Raw is required for PDF documents in Cloudinary
      public_id: Date.now() + '-' + Math.round(Math.random() * 1E9)
    };
  }
});

// File Filter for Images and Documents (PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF, WEBP) and PDF files are allowed!'));
  }
};

// Initialize Multer with Cloudinary Storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// @route   POST api/upload
// @desc    Upload an image or document to Cloudinary
// @access  Private (Admin only)
router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file was uploaded' });
  }

  // Return the secure cloud URL provided by Cloudinary
  res.json({ url: req.file.path });
}, (error, req, res, next) => {
  // Handle Multer errors or Cloudinary configuration errors
  res.status(400).json({ msg: error.message });
});

module.exports = router;
