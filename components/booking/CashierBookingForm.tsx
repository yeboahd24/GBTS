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
  Autocomplete,
  Grid,
} from '@mui/material';
import { Phone, Person, Payment, DirectionsBus, Search, SwapHoriz } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BookingData } from '../../types/schema';
import { PaymentMethod } from '../../types/enums';
import { formatCurrency, formatPhoneNumber, formatPaymentMethod } from '../../utils/formatters';
import { useGetTripsQuery, useBookTicketMutation } from '../../store/apiSlice';

const ghanaLocations = [
  'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Ho', 'Koforidua',
  'Sunyani', 'Wa', 'Bolgatanga', 'Techiman', 'Obuasi', 'Tema'
];

const CashierBookingForm: React.FC = () => {
  // Trip selection
  const [origin, setOrigin] = useState<string>('Accra');
  const [destination, setDestination] = useState<string>('Kumasi');
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  
  // Passenger details
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [paymentReference, setPaymentReference] = useState('');
  const [customFare, setCustomFare] = useState<string>('');
  
  // State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { data: trips = [], isLoading: tripsLoading, refetch } = useGetTripsQuery({
    origin,
    destination,
    departureDate: departureDate.toISOString().split('T')[0],
  });

  const [bookTicket, { isLoading: bookingLoading }] = useBookTicketMutation();

  const selectedTrip = trips.find(trip => trip.id === selectedTripId);
  const fare = customFare ? parseFloat(customFare) : (selectedTrip?.route?.baseFare || 0);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedTripId) {
      newErrors.trip = 'Please select a trip';
    }

    if (!passengerName.trim()) {
      newErrors.passengerName = 'Passenger name is required';
    }

    if (!passengerPhone.trim()) {
      newErrors.passengerPhone = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+233|0)[2-9]\d{8}$/;
      if (!phoneRegex.test(passengerPhone.trim())) {
        newErrors.passengerPhone = 'Please enter a valid Ghana phone number';
      }
    }

    // Seat number is optional - will be auto-assigned if not provided

    if (customFare && (isNaN(parseFloat(customFare)) || parseFloat(customFare) <= 0)) {
      newErrors.customFare = 'Please enter a valid fare amount';
    }

    if (paymentMethod !== PaymentMethod.CASH && !paymentReference.trim()) {
      newErrors.paymentReference = 'Payment reference is required for mobile money payments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const booking: BookingData = {
        tripId: selectedTripId,
        passengerName: passengerName.trim(),
        passengerPhone: formatPhoneNumber(passengerPhone.trim()),
        seatNumber: seatNumber.trim() || undefined, // Auto-assign if empty
        paymentMethod,
        paymentReference: paymentReference.trim() || undefined,
      };

      const result = await bookTicket(booking).unwrap();
      setBookingSuccess(true);
      
      console.log('Booking successful:', result);
      
      // Reset form after a short delay to show success message
      setTimeout(() => {
        setPassengerName('');
        setPassengerPhone('');
        setSeatNumber('');
        setPaymentReference('');
        setCustomFare('');
        setSelectedTripId('');
        setErrors({});
        setBookingSuccess(false);
      }, 3000);
      
    } catch (error) {
      setErrors({ booking: 'Booking failed. Please try again.' });
    }
  };

  const paymentMethods = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.MOMO_MTN, label: 'MTN Mobile Money' },
    { value: PaymentMethod.MOMO_VODAFONE, label: 'Vodafone Cash' },
    { value: PaymentMethod.MOMO_AIRTELTIGO, label: 'AirtelTigo Money' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cashier Booking System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Book tickets for passengers at the station
        </Typography>

        {bookingSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Ticket booked successfully! SMS sent to passenger.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Trip Selection */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <DirectionsBus sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Select Trip
                </Typography>
                
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Autocomplete
                      value={origin}
                      onChange={(_, newValue) => setOrigin(newValue || '')}
                      options={ghanaLocations}
                      renderInput={(params) => (
                        <TextField {...params} label="From" size="small" />
                      )}
                      sx={{ flex: 1 }}
                    />
                    
                    <Button
                      onClick={() => {
                        const temp = origin;
                        setOrigin(destination);
                        setDestination(temp);
                      }}
                      sx={{ minWidth: 'auto', p: 1 }}
                      color="primary"
                    >
                      <SwapHoriz />
                    </Button>
                    
                    <Autocomplete
                      value={destination}
                      onChange={(_, newValue) => setDestination(newValue || '')}
                      options={ghanaLocations}
                      renderInput={(params) => (
                        <TextField {...params} label="To" size="small" />
                      )}
                      sx={{ flex: 1 }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <DatePicker
                      label="Departure Date"
                      value={departureDate}
                      onChange={(newValue) => setDepartureDate(newValue || new Date())}
                      minDate={new Date()}
                      slotProps={{ textField: { size: 'small' } }}
                      sx={{ flex: 1 }}
                    />
                    
                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={() => refetch()}
                      disabled={tripsLoading}
                      sx={{ minHeight: 40 }}
                    >
                      Search
                    </Button>
                  </Stack>

                  {tripsLoading ? (
                    <Typography>Loading trips...</Typography>
                  ) : trips.length === 0 ? (
                    <Alert severity="info">
                      No trips found for {origin} to {destination} on {departureDate.toLocaleDateString()}.
                      Try different locations or dates.
                    </Alert>
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Found {trips.length} trip(s) available:
                      </Typography>
                      <RadioGroup
                        value={selectedTripId}
                        onChange={(e) => setSelectedTripId(e.target.value)}
                      >
                        {trips.map((trip) => (
                          <FormControlLabel
                            key={trip.id}
                            value={trip.id}
                            control={<Radio />}
                            label={
                              <Box sx={{ py: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {trip.departureTime} - {trip.bus?.registrationNumber}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {trip.passengerSeatsAvailable} seats available | {formatCurrency(trip.route?.baseFare || 0)}
                                </Typography>
                                <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                                  {trip.route?.origin} to {trip.route?.destination}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              border: '1px solid',
                              borderColor: selectedTripId === trip.id ? 'primary.main' : 'grey.300',
                              borderRadius: 1,
                              mb: 1,
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'primary.light'
                              }
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  )}
                  
                  {errors.trip && (
                    <Typography variant="caption" color="error">
                      {errors.trip}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Passenger & Payment Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Passenger & Payment Details
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Passenger Name"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      error={!!errors.passengerName}
                      helperText={errors.passengerName}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      placeholder="+233244123456"
                      error={!!errors.passengerPhone}
                      helperText={errors.passengerPhone}
                      size="small"
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Seat Number (Optional)"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      placeholder="e.g., 12A (leave empty for auto-assignment)"
                      error={!!errors.seatNumber}
                      helperText={errors.seatNumber || "Leave empty to auto-assign next available seat"}
                      size="small"
                    />

                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Custom Fare (Optional)"
                        value={customFare}
                        onChange={(e) => setCustomFare(e.target.value)}
                        placeholder={formatCurrency(selectedTrip?.route?.baseFare || 0)}
                        error={!!errors.customFare}
                        helperText={errors.customFare || `Default: ${formatCurrency(selectedTrip?.route?.baseFare || 0)}`}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                        <Typography variant="h6" color="primary.contrastText">
                          {formatCurrency(fare)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    <Typography variant="subtitle2">
                      <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Payment Method
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
                        label="Payment Reference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Enter mobile money transaction reference"
                        error={!!errors.paymentReference}
                        helperText={errors.paymentReference}
                        size="small"
                      />
                    )}

                    {errors.booking && (
                      <Alert severity="error">
                        {errors.booking}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={bookingLoading || !selectedTripId}
                      sx={{ py: 1.5 }}
                    >
                      {bookingLoading ? 'Booking Ticket...' : `Book Ticket - ${formatCurrency(fare)}`}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default CashierBookingForm;