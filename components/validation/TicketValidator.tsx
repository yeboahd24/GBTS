import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  QrCodeScanner, 
  Search, 
  CheckCircle, 
  Error, 
  Person,
  DirectionsBus,
  EventSeat,
  Schedule,
  Close
} from '@mui/icons-material';
import { Ticket } from '../../types/schema';
import { useCheckInTicketMutation } from '../../store/apiSlice';
import { formatCurrency, formatTicketCode, formatPhoneNumber } from '../../utils/formatters';

interface TicketValidatorProps {
  onValidationComplete?: (ticket: Ticket) => void;
}

const TicketValidator: React.FC<TicketValidatorProps> = ({ onValidationComplete }) => {
  const [ticketCode, setTicketCode] = useState('');
  const [validatedTicket, setValidatedTicket] = useState<Ticket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [error, setError] = useState('');
  const [checkInTicket, { isLoading }] = useCheckInTicketMutation();

  const handleValidateTicket = async () => {
    if (!ticketCode.trim()) {
      setError('Please enter a ticket code');
      return;
    }

    try {
      setError('');
      const result = await checkInTicket(ticketCode.trim()).unwrap();
      setValidatedTicket(result);
      setShowTicketDetails(true);
      if (onValidationComplete) {
        onValidationComplete(result);
      }
    } catch (err: any) {
      setError(err.data?.message || 'Ticket not found or invalid');
      setValidatedTicket(null);
    }
  };

  const handleScanQR = () => {
    // In a real app, this would open camera for QR scanning
    // For demo purposes, we'll simulate QR scanning
    alert('QR Scanner would open here. For demo, please enter ticket code manually.');
  };

  const handleCloseDetails = () => {
    setShowTicketDetails(false);
    setTicketCode('');
    setValidatedTicket(null);
    setError('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'primary';
      case 'checked_in': return 'success';
      case 'used': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ticket Validation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Scan QR code or enter ticket code to validate passenger tickets
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* QR Scanner Button */}
            <Button
              variant="outlined"
              size="large"
              startIcon={<QrCodeScanner />}
              onClick={handleScanQR}
              sx={{ py: 2 }}
            >
              Scan QR Code
            </Button>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Manual Entry */}
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Enter Ticket Code"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                placeholder="e.g., 12345678"
                inputProps={{ maxLength: 8 }}
                error={!!error}
                helperText={error || 'Enter the 8-digit ticket code'}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={handleValidateTicket}
                disabled={isLoading || !ticketCode.trim()}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Validating...' : 'Validate Ticket'}
              </Button>
            </Stack>

            {/* Quick Status Display */}
            {validatedTicket && !showTicketDetails && (
              <Alert 
                severity="success" 
                icon={<CheckCircle />}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => setShowTicketDetails(true)}
                  >
                    View Details
                  </Button>
                }
              >
                Ticket {formatTicketCode(validatedTicket.ticketCode)} validated successfully!
              </Alert>
            )}

            {error && (
              <Alert severity="error" icon={<Error />}>
                {error}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Ticket Details Modal */}
      <Dialog
        open={showTicketDetails}
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Ticket Details</Typography>
            <IconButton onClick={handleCloseDetails}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {validatedTicket && (
            <Stack spacing={3}>
              {/* Status */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatTicketCode(validatedTicket.ticketCode)}
                </Typography>
                <Chip 
                  label={validatedTicket.status.toUpperCase().replace('_', ' ')} 
                  color={getStatusColor(validatedTicket.status)}
                  size="large"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Divider />

              {/* Passenger Info */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Passenger Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {validatedTicket.passengerName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatPhoneNumber(validatedTicket.passengerPhone)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Trip Info */}
              <Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  <DirectionsBus sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Trip Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Seat Number:</Typography>
                    <Chip 
                      label={validatedTicket.seatNumber} 
                      color="primary" 
                      size="small"
                      icon={<EventSeat />}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Fare Paid:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {formatCurrency(validatedTicket.farePaid)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Booked:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {new Date(validatedTicket.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Validation Actions */}
              {validatedTicket.status === 'booked' && (
                <Alert severity="info" icon={<Schedule />}>
                  This ticket is ready for boarding. Passenger can proceed to their seat.
                </Alert>
              )}

              {validatedTicket.status === 'checked_in' && (
                <Alert severity="success" icon={<CheckCircle />}>
                  This ticket has already been validated and passenger is checked in.
                </Alert>
              )}

              {validatedTicket.status === 'used' && (
                <Alert severity="warning">
                  This ticket has already been used for a completed trip.
                </Alert>
              )}

              {validatedTicket.status === 'cancelled' && (
                <Alert severity="error">
                  This ticket has been cancelled and is not valid for travel.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
          {validatedTicket?.status === 'booked' && (
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                // In a real app, this would mark the ticket as used
                alert('Passenger checked in successfully!');
                handleCloseDetails();
              }}
            >
              Confirm Check-in
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketValidator;