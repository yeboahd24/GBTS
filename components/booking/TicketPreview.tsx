import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { QrCode, Sms, Print, Close } from '@mui/icons-material';
import QRCode from 'qrcode';
import { Ticket, Trip } from '../../types/schema';
import { formatCurrency, formatTicketCode, formatPaymentMethod, formatPhoneNumber } from '../../utils/formatters';

interface TicketPreviewProps {
  open: boolean;
  ticket: Ticket;
  trip: Trip;
  onClose: () => void;
  onPrint?: () => void;
}

const TicketPreview: React.FC<TicketPreviewProps> = ({ 
  open, 
  ticket, 
  trip, 
  onClose, 
  onPrint 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          ticketId: ticket.id,
          ticketCode: ticket.ticketCode,
          tripId: ticket.tripId,
          passengerName: ticket.passengerName,
          passengerPhone: ticket.passengerPhone,
          seatNumber: ticket.seatNumber,
          route: `${trip.route?.origin} to ${trip.route?.destination}`,
          departureDate: trip.departureDate,
          departureTime: trip.departureTime,
          fare: ticket.farePaid,
          status: ticket.status
        });
        
        const url = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (open && ticket) {
      generateQRCode();
    }
  }, [open, ticket, trip]);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="h2" color="primary">
          Ticket Confirmation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your ticket has been booked successfully
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            backgroundColor: 'grey.50'
          }}
        >
          <Stack spacing={3}>
            {/* Header with Ticket Code */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatTicketCode(ticket.ticketCode)}
              </Typography>
              <Chip 
                label={ticket.status.toUpperCase()} 
                color="success" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            <Divider />

            {/* QR Code Section */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                <QrCode sx={{ mr: 1, verticalAlign: 'middle' }} />
                QR Code
              </Typography>
              {qrCodeUrl ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <img 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    style={{ maxWidth: '200px', height: 'auto' }}
                  />
                </Box>
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">Generating QR Code...</Typography>
                </Box>
              )}
              <Typography variant="body2" color="text.secondary">
                Show this QR code to the conductor for validation
              </Typography>
            </Box>

            <Divider />

            {/* Trip Information */}
            <Stack spacing={2}>
              <Typography variant="h6" color="primary">
                Trip Details
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Route:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {trip.route?.origin} to {trip.route?.destination}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Date:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {new Date(trip.departureDate).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Departure:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {trip.departureTime}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Bus:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {trip.bus?.registrationNumber}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Seat:</Typography>
                  <Chip 
                    label={ticket.seatNumber} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Stack>
            </Stack>

            <Divider />

            {/* Passenger Information */}
            <Stack spacing={2}>
              <Typography variant="h6" color="primary">
                Passenger Details
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {ticket.passengerName}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatPhoneNumber(ticket.passengerPhone)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Divider />

            {/* Payment Information */}
            <Stack spacing={2}>
              <Typography variant="h6" color="primary">
                Payment Details
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Amount Paid:</Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(ticket.farePaid)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Payment Method:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatPaymentMethod(ticket.paymentMethod)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* SMS Status */}
            {ticket.smsSent && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 2,
                backgroundColor: 'success.light',
                borderRadius: 1
              }}>
                <Sms sx={{ mr: 1, color: 'success.dark' }} />
                <Typography variant="body2" color="success.dark">
                  SMS ticket sent to {formatPhoneNumber(ticket.passengerPhone)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Please arrive at the station 30 minutes before departure
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} startIcon={<Close />}>
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={handlePrint} 
          startIcon={<Print />}
        >
          Print Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketPreview;