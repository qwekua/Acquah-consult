const PayStack = require('paystack-api');

class PaystackService {
  constructor() {
    this.paystack = PayStack(process.env.PAYSTACK_SECRET_KEY);
  }

  async initializePayment(data) {
    try {
      const response = await this.paystack.transaction.initialize({
        email: data.email,
        amount: data.amount * 100, // Convert to kobo
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: {
          applicationType: data.applicationType,
          applicationId: data.applicationId,
          userId: data.userId,
          custom_fields: [
            {
              display_name: "Application Type",
              variable_name: "application_type",
              value: data.applicationType
            },
            {
              display_name: "Application ID",
              variable_name: "application_id", 
              value: data.applicationId
            }
          ]
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return {
        success: false,
        message: error.message || 'Payment initialization failed'
      };
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await this.paystack.transaction.verify(reference);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Paystack verification error:', error);
      return {
        success: false,
        message: error.message || 'Payment verification failed'
      };
    }
  }

  async getPaymentHistory(email) {
    try {
      const response = await this.paystack.transaction.list({
        customer: email
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Paystack history error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get payment history'
      };
    }
  }

  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `AC_${timestamp}_${random}`.toUpperCase();
  }

  calculateAmount(applicationType) {
    const prices = {
      'birth_certificate': 40000, // GHC 400 in pesewas
      'passport': 140000, // GHC 1400 in pesewas
      'both': 180000 // GHC 1800 in pesewas
    };

    return prices[applicationType] || 0;
  }
}

module.exports = new PaystackService();