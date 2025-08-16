import React, { useState } from 'react';
import { Box, Typography, Stack, Stepper, Step, StepLabel, Alert } from '@mui/material';
import RouteSelector from './RouteSelector';
import SeatMap from './SeatMap';
import BookingForm from './BookingForm';
import TicketPreview from './TicketPreview';
import { Trip, Bus, Ticket, BookingData } from '../../types/schema';
import { useGetBusesQuery, useGetTicketsQuery, useBookTicketMutation } from '../../store/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const steps = ['Select Route', 'Choose Seat', 'Passenger Details', 'Confirmation'];

const BookingPage: React.FC = () => {
  const { selectedCompany } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [bookedTicket, setBookedTicket] = useState<Ticket | null>(null);
  const [showTicketPreview, setShowTicketPreview] = useState(false);

  const { data: buses = [] } = useGetBusesQuery(selectedCompany?.id);
  const { data: tickets = [] } = useGetTicketsQuery(
    selectedTrip ? { tripId: selectedTrip.id } : {}
  );
  const [bookTicket, { isLoading: bookingLoading, error: bookingError }] = useBookTicketMutation();

  const selectedBus = buses.find(bus => bus.id === selectedTrip?.busId);
  const occupiedSeats = tickets.map(ticket => ticket.seatNumber);

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    setSelectedSeat('');
    setActiveStep(1);
  };

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeat(seatNumber);
    setActiveStep(2);
  };

  const handleSkipSeatSelection = () => {
    setSelectedSeat(''); // Clear any selected seat for auto-assignment
    setActiveStep(2);
  };

  const handleBookTicket = async (booking: BookingData) => {
    try {
      const result = await bookTicket(booking).unwrap();
      setBookedTicket(result);
      setShowTicketPreview(true);
      setActiveStep(3);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleTicketPreviewClose = () => {
    setShowTicketPreview(false);
    // Reset the booking flow
    setActiveStep(0);
    setSelectedTrip(null);
    setSelectedSeat('');
    setBookedTicket(null);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <RouteSelector onTripSelect={handleTripSelect} />;
      
      case 1:
        if (!selectedTrip || !selectedBus) return null;
        return (
          <SeatMap
            trip={selectedTrip}
            bus={selectedBus}
            occupiedSeats={occupiedSeats}
            selectedSeat={selectedSeat}
            onSeatSelect={handleSeatSelect}
            onSkipSeatSelection={handleSkipSeatSelection}
          />
        );
      
      case 2:
        if (!selectedTrip) return null;
        return (
          <BookingForm
            trip={selectedTrip}
            selectedSeat={selectedSeat}
            onBookTicket={handleBookTicket}
            loading={bookingLoading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Book Ticket
      </Typography>

      <Stack spacing={4}>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Display */}
        {bookingError && (
          <Alert severity="error">
            Booking failed. Please try again.
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ minHeight: 400 }}>
          {renderStepContent()}
        </Box>
      </Stack>

      {/* Ticket Preview Modal */}
      {bookedTicket && selectedTrip && (
        <TicketPreview
          open={showTicketPreview}
          ticket={bookedTicket}
          trip={selectedTrip}
          onClose={handleTicketPreviewClose}
        />
      )}
    </Box>
  );
};

export default BookingPage;