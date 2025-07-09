const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const paystackService = require('../services/paystack');

const router = express.Router();

// Initialize payment
router.post('/initialize', auth, [
  body('applicationId').notEmpty().withMessage('Application ID is required'),
  body('applicationType').isIn(['birth_certificate', 'passport', 'both']).withMessage('Valid application type is required')
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

    const { applicationId, applicationType } = req.body;

    // Check if application exists and belongs to user
    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if payment already exists for this application
    const existingPayment = await Payment.findOne({
      applicationId,
      status: { $in: ['success', 'pending'] }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this application'
      });
    }

    const reference = paystackService.generateReference();
    const amount = paystackService.calculateAmount(applicationType);

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      applicationId,
      reference,
      amount: amount / 100, // Store in GHS
      applicationType,
      status: 'pending'
    });

    await payment.save();

    // Initialize Paystack payment
    const paymentData = {
      email: req.user.email,
      amount: amount / 100, // Paystack expects amount in GHS
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      applicationType,
      applicationId: applicationId.toString(),
      userId: req.user._id.toString()
    };

    const paystackResponse = await paystackService.initializePayment(paymentData);

    if (!paystackResponse.success) {
      await Payment.findByIdAndUpdate(payment._id, { 
        status: 'failed',
        failureReason: paystackResponse.message 
      });

      return res.status(400).json({
        success: false,
        message: paystackResponse.message
      });
    }

    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        paymentId: payment._id,
        reference,
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        amount: amount / 100
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment initialization'
    });
  }
});

// Verify payment
router.post('/verify', auth, [
  body('reference').notEmpty().withMessage('Payment reference is required')
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

    const { reference } = req.body;

    // Find payment record
    const payment = await Payment.findOne({ reference }).populate('applicationId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify with Paystack
    const verificationResponse = await paystackService.verifyPayment(reference);

    if (!verificationResponse.success) {
      return res.status(400).json({
        success: false,
        message: verificationResponse.message
      });
    }

    const paystackData = verificationResponse.data;

    // Update payment record
    const updateData = {
      status: paystackData.status === 'success' ? 'success' : 'failed',
      paystackData,
      paidAt: paystackData.status === 'success' ? new Date() : undefined,
      failureReason: paystackData.status !== 'success' ? paystackData.gateway_response : undefined
    };

    await Payment.findByIdAndUpdate(payment._id, updateData);

    // Update application status if payment successful
    if (paystackData.status === 'success') {
      await Application.findByIdAndUpdate(payment.applicationId._id, {
        status: 'in_progress',
        $push: {
          statusHistory: {
            status: 'in_progress',
            notes: 'Payment confirmed - Application processing started'
          }
        }
      });
    }

    res.json({
      success: true,
      message: paystackData.status === 'success' ? 'Payment verified successfully' : 'Payment verification failed',
      data: {
        status: paystackData.status,
        amount: paystackData.amount / 100,
        currency: paystackData.currency,
        paid_at: paystackData.paid_at,
        application: {
          id: payment.applicationId._id,
          applicationId: payment.applicationId.applicationId,
          type: payment.applicationType
        }
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification'
    });
  }
});

// Get payment history for user
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('applicationId', 'applicationId type status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment._id,
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        applicationType: payment.applicationType,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        application: payment.applicationId ? {
          id: payment.applicationId._id,
          applicationId: payment.applicationId.applicationId,
          type: payment.applicationId.type,
          status: payment.applicationId.status
        } : null
      }))
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving payment history'
    });
  }
});

// Paystack webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const hash = require('crypto')
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, status, amount, currency, paid_at } = event.data;

      // Update payment record
      const payment = await Payment.findOne({ reference });
      if (payment) {
        await Payment.findByIdAndUpdate(payment._id, {
          status: 'success',
          paystackData: event.data,
          paidAt: new Date(paid_at)
        });

        // Update application status
        await Application.findByIdAndUpdate(payment.applicationId, {
          status: 'in_progress',
          $push: {
            statusHistory: {
              status: 'in_progress',
              notes: 'Payment confirmed via webhook - Application processing started'
            }
          }
        });
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
});

module.exports = router;