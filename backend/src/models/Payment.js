const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  reference: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'GHS'
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'abandoned'],
    default: 'pending'
  },
  applicationType: {
    type: String,
    enum: ['birth_certificate', 'passport', 'both'],
    required: true
  },
  paystackData: {
    type: Object,
    default: {}
  },
  paidAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ applicationId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);