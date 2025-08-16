import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { Phone, Person, Payment } from '@mui/icons-material';
import { Trip, BookingData } from '../../types/schema';
import { PaymentMethod } from '../../types/enums';
import { formatCurrency, formatPhoneNumber, formatPaymentMethod } from '../../utils/formatters';
import { paymentGateway, PaymentResponse } from '../../utils/paymentGateway';

interface BookingFormProps {
  trip: Trip;
  selectedSeat?: string; // Optional - can be auto-assigned
  onBookTicket: (booking: BookingData) => void;
  loading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  trip, 
  selectedSeat = '', // Default to empty string for auto-assignment
  onBookTicket, 
  loading = false 
}) => {
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [paymentReference, setPaymentReference] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required';
    }

    if (!passengerPhone.trim()) {
      newErrors.passengerPhone = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+233|0)[2-9]\d{8}$/;
      if (!phoneRegex.test(passengerPhone)) {
        newErrors.passengerPhone = 'Please enter a valid Ghana phone number';
      }
    }

    if (paymentMethod !== PaymentMethod.CASH && !paymentReference.trim()) {
      newErrors.paymentReference = 'Payment reference is required for mobile money';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Handle mobile money payments
    if (paymentMethod !== PaymentMethod.CASH && paymentMethod !== PaymentMethod.CARD) {
      await handleMobileMoneyPayment();
    } else {
      // For cash and card payments, proceed directly
      const booking: BookingData = {
        tripId: trip.id,
        passengerName: passengerName.trim(),
        passengerPhone: formatPhoneNumber(passengerPhone.trim()),
        seatNumber: selectedSeat || undefined, // Let backend auto-assign if empty
        paymentMethod,
        paymentReference: paymentReference.trim() || undefined,
      };

      onBookTicket(booking);
    }
  };

  const handleMobileMoneyPayment = async () => {
    setPaymentProcessing(true);
    setPaymentStatus('processing');

    try {
      const paymentResponse = await paymentGateway.processPayment({
        amount: trip.route?.baseFare || 0,
        phoneNumber: passengerPhone.trim(),
        paymentMethod,
      });

      if (paymentResponse.success) {
        setPaymentStatus('success');
        setPaymentReference(paymentResponse.reference || '');
        
        // Proceed with booking after successful payment
        const booking: BookingData = {
          tripId: trip.id,
          passengerName: passengerName.trim(),
          passengerPhone: formatPhoneNumber(passengerPhone.trim()),
          seatNumber: selectedSeat || undefined, // Let backend auto-assign if empty
          paymentMethod,
          paymentReference: paymentResponse.reference,
        };

        onBookTicket(booking);
      } else {
        setPaymentStatus('failed');
        setErrors({ payment: paymentResponse.message });
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrors({ payment: 'Payment processing failed. Please try again.' });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const paymentMethods = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.MOMO_MTN, label: 'MTN Mobile Money' },
    { value: PaymentMethod.MOMO_VODAFONE, label: 'Vodafone Cash' },
    { value: PaymentMethod.MOMO_AIRTELTIGO, label: 'AirtelTigo Money' },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Passenger Details & Payment
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Trip Summary */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Trip Summary
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Route:</strong> {trip.route?.origin} → {trip.route?.destination}
                </Typography>
                <Typography variant="body2">
                  <strong>Departure:</strong> {trip.departureDate} at {trip.departureTime}
                </Typography>
                <Typography variant="body2">
                  <strong>Bus:</strong> {trip.bus?.registrationNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Seat:</strong> {selectedSeat || 'Auto-assigned'}
                </Typography>
                <Typography variant="h6" color="primary">
                  <strong>Fare:</strong> {formatCurrency(trip.route?.baseFare || 0)}
                </Typography>
              </Stack>
            </Box>

            <Divider />

            {/* Passenger Information */}
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> Passenger Information
              </Typography>
              
              <TextField
                fullWidth
                label="Full Name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                error={!!errors.passengerName}
                helperText={errors.passengerName}
                required
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                error={!!errors.passengerPhone}
                helperText={errors.passengerPhone || 'Format: +233XXXXXXXXX or 0XXXXXXXXX'}
                placeholder="+233244123456"
                required
              />
            </Stack>

            <Divider />

            {/* Payment Method */}
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment /> Payment Method
              </Typography>
              
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                {paymentMethods.map((method) => (
                  <FormControlLabel
                    key={method.value}
                    value={method.value}
                    control={<Radio />}
                    label={method.label}
                  />
                ))}
              </RadioGroup>

              {paymentMethod !== PaymentMethod.CASH && (
                <TextField
                  fullWidth
                  label="Mobile Money Transaction Reference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  error={!!errors.paymentReference}
                  helperText={errors.paymentReference || 'Enter the transaction ID from your mobile money payment'}
                  placeholder="MP240101.1234.A12345"
                  required
                />
              )}
            </Stack>

            {/* Payment Status */}
            {paymentStatus === 'processing' && (
              <Alert severity="info">
                Processing {formatPaymentMethod(paymentMethod)} payment...
              </Alert>
            )}
            
            {paymentStatus === 'success' && (
              <Alert severity="success">
                Payment successful! Reference: {paymentReference}
              </Alert>
            )}
            
            {paymentStatus === 'failed' && errors.payment && (
              <Alert severity="error">
                {errors.payment}
              </Alert>
            )}

            {paymentMethod !== PaymentMethod.CASH && paymentStatus === 'idle' && (
              <Alert severity="info">
                Click "Process Payment" to complete your {formatPaymentMethod(paymentMethod)} transaction.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || paymentProcessing}
              sx={{ py: 1.5 }}
            >
              {paymentProcessing 
                ? 'Processing Payment...' 
                : loading 
                ? 'Booking Ticket...' 
                : paymentMethod === PaymentMethod.CASH 
                ? `Book Ticket - ${formatCurrency(trip.route?.baseFare || 0)}`
                : `Process Payment - ${formatCurrency(trip.route?.baseFare || 0)}`
              }
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookingForm;