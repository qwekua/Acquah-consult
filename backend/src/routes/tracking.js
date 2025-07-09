const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');

const router = express.Router();

// Track application by application ID
router.get('/application/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findOne({ applicationId })
      .select('applicationId type status submittedAt statusHistory')
      .populate('userId', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application: {
        applicationId: application.applicationId,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt,
        statusHistory: application.statusHistory,
        applicant: {
          name: `${application.userId.firstName} ${application.userId.lastName}`,
          email: application.userId.email
        }
      }
    });
  } catch (error) {
    console.error('Track application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application tracking'
    });
  }
});

// Track application by email
router.post('/by-email', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find user by email first
    const User = require('../models/User');
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No applications found for this email'
      });
    }

    const applications = await Application.find({ userId: user._id })
      .select('applicationId type status submittedAt statusHistory')
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No applications found for this email'
      });
    }

    res.json({
      success: true,
      applications: applications.map(app => ({
        applicationId: app.applicationId,
        type: app.type,
        status: app.status,
        submittedAt: app.submittedAt,
        statusHistory: app.statusHistory
      }))
    });
  } catch (error) {
    console.error('Track by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application tracking'
    });
  }
});

module.exports = router;