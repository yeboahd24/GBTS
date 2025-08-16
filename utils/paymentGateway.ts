import { PaymentMethod } from '../types/enums';

export interface PaymentRequest {
  amount: number;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  reference?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  message: string;
  status: 'pending' | 'completed' | 'failed';
}

// Simulated Mobile Money Payment Gateway
export class MobileMoneyGateway {
  private static instance: MobileMoneyGateway;

  public static getInstance(): MobileMoneyGateway {
    if (!MobileMoneyGateway.instance) {
      MobileMoneyGateway.instance = new MobileMoneyGateway();
    }
    return MobileMoneyGateway.instance;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment processing logic
    const isValidPhone = this.validatePhoneNumber(request.phoneNumber, request.paymentMethod);
    const hasValidAmount = request.amount > 0 && request.amount <= 10000; // Max 10,000 GHS

    if (!isValidPhone) {
      return {
        success: false,
        message: 'Invalid phone number for selected payment method',
        status: 'failed'
      };
    }

    if (!hasValidAmount) {
      return {
        success: false,
        message: 'Invalid payment amount',
        status: 'failed'
      };
    }

    // Simulate random success/failure (90% success rate)
    const isSuccessful = Math.random() > 0.1;

    if (isSuccessful) {
      const transactionId = this.generateTransactionId();
      return {
        success: true,
        transactionId,
        reference: `${this.getProviderPrefix(request.paymentMethod)}${transactionId}`,
        message: 'Payment processed successfully',
        status: 'completed'
      };
    } else {
      return {
        success: false,
        message: 'Payment failed. Please try again or check your account balance.',
        status: 'failed'
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResponse> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple verification simulation
    if (reference && reference.length > 10) {
      return {
        success: true,
        reference,
        message: 'Payment verified successfully',
        status: 'completed'
      };
    }

    return {
      success: false,
      message: 'Payment verification failed',
      status: 'failed'
    };
  }

  private validatePhoneNumber(phone: string, method: PaymentMethod): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    
    switch (method) {
      case PaymentMethod.MOMO_MTN:
        // MTN numbers start with 024, 054, 055, 059
        return /^(233)?(24|54|55|59)\d{7}$/.test(cleanPhone);
      
      case PaymentMethod.MOMO_VODAFONE:
        // Vodafone numbers start with 020, 050
        return /^(233)?(20|50)\d{7}$/.test(cleanPhone);
      
      case PaymentMethod.MOMO_AIRTELTIGO:
        // AirtelTigo numbers start with 027, 057, 026, 056
        return /^(233)?(27|57|26|56)\d{7}$/.test(cleanPhone);
      
      default:
        return true; // For cash and card payments
    }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}${random}`.substring(0, 12);
  }

  private getProviderPrefix(method: PaymentMethod): string {
    switch (method) {
      case PaymentMethod.MOMO_MTN:
        return 'MTN';
      case PaymentMethod.MOMO_VODAFONE:
        return 'VOD';
      case PaymentMethod.MOMO_AIRTELTIGO:
        return 'ATL';
      default:
        return 'PAY';
    }
  }
}

// Export singleton instance
export const paymentGateway = MobileMoneyGateway.getInstance();