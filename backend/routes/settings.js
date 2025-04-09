import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
import protect from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
console.log('Cloudinary Configuration:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
  }
});

// Get user settings
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      theme: user.theme,
      weeklyReminder: user.weeklyReminder,
      monthlyReminder: user.monthlyReminder,
      emailNotification: user.emailNotification,
      profilePicture: user.profilePicture || ''
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const sendSettingsChangeEmail = async (user, changes) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const changesList = Object.entries(changes)
      .filter(([key, value]) => value !== undefined && key !== 'sendChangeNotification')
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Job Compass - Account Settings Changed',
      text: `Hello ${user.name},\n\nYour account settings have been updated:\n\n${changesList}\n\nIf you did not make these changes, please contact support immediately.`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending settings change email:', error);
  }
};

// Upload profile picture
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Detailed Cloudinary configuration check
    const cloudinaryConfig = cloudinary.config();
    console.log('Cloudinary Configuration:', {
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key ? '***' : 'MISSING',
      api_secret: cloudinaryConfig.api_secret ? '***' : 'MISSING'
    });

    if (!cloudinaryConfig.cloud_name ||
      !cloudinaryConfig.api_key ||
      !cloudinaryConfig.api_secret) {
      console.error('Incomplete Cloudinary configuration');
      return res.status(500).json({
        message: 'Cloudinary configuration is incomplete. Please set environment variables.',
        details: {
          cloud_name: !!cloudinaryConfig.cloud_name,
          api_key: !!cloudinaryConfig.api_key,
          api_secret: !!cloudinaryConfig.api_secret
        }
      });
    }

    // Upload image to Cloudinary with more robust error handling
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'job-compass-profile-pictures',
          transformation: [
            { width: 500, height: 500, crop: 'fill' }, // Crop and resize
            { quality: 'auto' } // Auto optimize quality
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user's profile picture URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: uploadResult.secure_url },
      { new: true }
    );

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: uploadResult.secure_url
    });
  } catch (error) {
    console.error('Profile picture upload error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      message: 'Failed to upload profile picture',
      error: {
        message: error.message,
        name: error.name
      }
    });
  }
});

// Update user settings
router.patch('/update', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      email,
      currentPassword,
      newPassword,
      theme,
      weeklyReminder,
      monthlyReminder,
      emailNotification,
      sendChangeNotification = true
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an update object
    const updateFields = {};

    // Handle name update
    if (name && name !== user.name) {
      updateFields.name = name;
    }

    // Handle email update
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      updateFields.email = email;
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle other settings
    if (theme !== undefined) updateFields.theme = theme;
    if (weeklyReminder !== undefined) updateFields.weeklyReminder = weeklyReminder;
    if (monthlyReminder !== undefined) updateFields.monthlyReminder = monthlyReminder;
    if (emailNotification !== undefined) updateFields.emailNotification = emailNotification;

    // Update user with new fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send change notification email if requested
    if (sendChangeNotification && Object.keys(updateFields).length > 0) {
      await sendSettingsChangeEmail(updatedUser, updateFields);
    }

    // Return updated user settings
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      theme: updatedUser.theme,
      weeklyReminder: updatedUser.weeklyReminder,
      monthlyReminder: updatedUser.monthlyReminder,
      emailNotification: updatedUser.emailNotification
    });

  } catch (error) {
    console.error('Settings update error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      requestBody: JSON.stringify(req.body),
      userId: req.user?._id,
      validationErrors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
    
    // Send appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      message: 'Failed to update settings',
      error: {
        message: error.message,
        name: error.name
      }
    });
  }
});

// Keep PUT route for backwards compatibility
router.put('/update', protect, async (req, res) => {
  // Reuse the PATCH route handler
  return router.patch('/update')(req, res);
});

export default router;