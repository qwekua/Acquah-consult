const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['birth_certificate', 'passport', 'both'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  
  // Birth Certificate Data
  birthCertificate: {
    firstName: String,
    lastName: String,
    otherNames: String,
    dateOfBirth: Date,
    religion: String,
    motherName: String,
    motherOccupation: String,
    fatherName: String,
    fatherOccupation: String,
    placeOfBirth: String,
    contactPhone: String,
    contactEmail: String,
    contactAddress: String,
    ghanaCardFile: String
  },
  
  // Passport Data
  passport: {
    name: String,
    dateOfBirth: Date,
    maritalStatus: String,
    postalAddress: String,
    placeOfIssue: String,
    employmentStatus: String,
    email: String,
    streetName: String,
    residentialAddress: String,
    telephone: String,
    
    // Father's Details
    fatherName: String,
    fatherHometown: String,
    fatherAddress: String,
    fatherEmail: String,
    fatherLiving: String,
    fatherPhone: String,
    
    // Mother's Details
    motherName: String,
    motherHometown: String,
    motherAddress: String,
    motherEmail: String,
    motherLiving: String,
    motherPhone: String,
    
    // Grandparent Details
    grandparentName: String,
    grandparentHometown: String,
    grandparentAddress: String,
    grandparentEmail: String,
    grandparentLiving: String,
    grandparentPhone: String,
    
    // Guarantors
    guarantor1Name: String,
    guarantor1Occupation: String,
    guarantor1Email: String,
    guarantor1Address: String,
    guarantor1Phone: String,
    
    guarantor2Name: String,
    guarantor2Occupation: String,
    guarantor2Email: String,
    guarantor2Address: String,
    guarantor2Phone: String,
    
    // Education
    lastSchool: String,
    
    // Witness
    witnessName: String,
    witnessBusinessPhone: String,
    witnessResidentialPhone: String,
    witnessBusinessAddress: String,
    witnessResidentialAddress: String,
    witnessOccupation: String,
    witnessPhone: String,
    witnessEmail: String,
    witnessPosition: String,
    witnessCardId: String,
    witnessCardNumber: String,
    witnessDateOfIssue: Date,
    witnessPlaceOfIssue: String,
    
    birthCertificateFile: String
  },
  
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  statusHistory: [{
    status: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Generate unique application ID
applicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.applicationId = `AC-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);