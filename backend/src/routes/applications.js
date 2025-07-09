const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Submit birth certificate application
router.post('/birth-certificate', auth, upload.single('ghanaCard'), [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('religion').notEmpty().withMessage('Religion is required'),
  body('motherName').trim().isLength({ min: 2 }).withMessage('Mother\'s name is required'),
  body('fatherName').trim().isLength({ min: 2 }).withMessage('Father\'s name is required'),
  body('motherOccupation').notEmpty().withMessage('Mother\'s occupation is required'),
  body('fatherOccupation').notEmpty().withMessage('Father\'s occupation is required'),
  body('contactPhone').isMobilePhone().withMessage('Valid phone number is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required'),
  body('contactAddress').notEmpty().withMessage('Contact address is required')
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

    const birthCertificateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      otherNames: req.body.otherNames || '',
      dateOfBirth: req.body.dateOfBirth,
      religion: req.body.religion,
      motherName: req.body.motherName,
      motherOccupation: req.body.motherOccupation,
      fatherName: req.body.fatherName,
      fatherOccupation: req.body.fatherOccupation,
      placeOfBirth: req.body.placeOfBirth || '',
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail,
      contactAddress: req.body.contactAddress,
      ghanaCardFile: req.file ? req.file.filename : null
    };

    const application = new Application({
      userId: req.user._id,
      type: 'birth_certificate',
      birthCertificate: birthCertificateData,
      statusHistory: [{
        status: 'pending',
        notes: 'Application submitted successfully'
      }]
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Birth certificate application submitted successfully',
      applicationId: application.applicationId,
      application: {
        id: application._id,
        applicationId: application.applicationId,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });
  } catch (error) {
    console.error('Birth certificate application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    });
  }
});

// Submit passport application
router.post('/passport', auth, upload.single('birthCertificate'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('maritalStatus').notEmpty().withMessage('Marital status is required'),
  body('postalAddress').notEmpty().withMessage('Postal address is required'),
  body('placeOfIssue').notEmpty().withMessage('Place of issue is required'),
  body('employmentStatus').notEmpty().withMessage('Employment status is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('telephone').isMobilePhone().withMessage('Valid phone number is required'),
  body('fatherName').notEmpty().withMessage('Father\'s name is required'),
  body('motherName').notEmpty().withMessage('Mother\'s name is required'),
  body('grandparentName').notEmpty().withMessage('At least one grandparent\'s name is required'),
  body('guarantor1Name').notEmpty().withMessage('First guarantor\'s name is required'),
  body('guarantor2Name').notEmpty().withMessage('Second guarantor\'s name is required'),
  body('witnessName').notEmpty().withMessage('Witness name is required')
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

    const passportData = {
      ...req.body,
      birthCertificateFile: req.file ? req.file.filename : null
    };

    const application = new Application({
      userId: req.user._id,
      type: 'passport',
      passport: passportData,
      statusHistory: [{
        status: 'pending',
        notes: 'Passport application submitted successfully'
      }]
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Passport application submitted successfully',
      applicationId: application.applicationId,
      application: {
        id: application._id,
        applicationId: application.applicationId,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });
  } catch (error) {
    console.error('Passport application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    });
  }
});

// Submit both applications
router.post('/both', auth, upload.fields([
  { name: 'ghanaCard', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 }
]), async (req, res) => {
  try {
    const { birthCertificate: bcData, passport: passportData } = req.body;

    const birthCertificateInfo = {
      ...bcData,
      ghanaCardFile: req.files?.ghanaCard?.[0]?.filename || null
    };

    const passportInfo = {
      ...passportData,
      birthCertificateFile: req.files?.birthCertificate?.[0]?.filename || null
    };

    const application = new Application({
      userId: req.user._id,
      type: 'both',
      birthCertificate: birthCertificateInfo,
      passport: passportInfo,
      statusHistory: [{
        status: 'pending',
        notes: 'Both applications submitted successfully'
      }]
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Both applications submitted successfully',
      applicationId: application.applicationId,
      application: {
        id: application._id,
        applicationId: application.applicationId,
        type: application.type,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });
  } catch (error) {
    console.error('Both applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    });
  }
});

// Get user's applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .select('applicationId type status submittedAt statusHistory')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving applications'
    });
  }
});

module.exports = router;