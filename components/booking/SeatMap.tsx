import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bus, Trip } from '../../types/schema';

const SeatButton = styled(Button)<{ 
  isOccupied?: boolean; 
  isSelected?: boolean; 
  isReserved?: boolean; 
}>(({ theme, isOccupied, isSelected, isReserved }) => ({
  minWidth: 40,
  height: 40,
  fontSize: '0.75rem',
  fontWeight: 600,
  border: `2px solid ${theme.palette.divider}`,
  backgroundColor: isSelected 
    ? theme.palette.primary.main 
    : isOccupied || isReserved
    ? theme.palette.grey[300]
    : theme.palette.background.paper,
  color: isSelected 
    ? theme.palette.primary.contrastText
    : isOccupied || isReserved
    ? theme.palette.text.disabled
    : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isOccupied || isReserved
      ? theme.palette.grey[300]
      : isSelected
      ? theme.palette.primary.dark
      : theme.palette.grey[100],
  },
  '&:disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.disabled,
  },
}));

interface SeatMapProps {
  trip: Trip;
  bus: Bus;
  occupiedSeats: string[];
  selectedSeat?: string;
  onSeatSelect: (seatNumber: string) => void;
  onSkipSeatSelection?: () => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ 
  trip, 
  bus, 
  occupiedSeats, 
  selectedSeat, 
  onSeatSelect,
  onSkipSeatSelection
}) => {
  // Generate seat layout based on bus capacity
  const generateSeatLayout = () => {
    const seats = [];
    const seatsPerRow = 4; // 2 seats on each side of aisle
    const rows = Math.ceil(bus.capacity / seatsPerRow);
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      
      // Left side seats (A, B)
      for (let seatLetter of ['A', 'B']) {
        const seatNumber = `${row}${seatLetter}`;
        rowSeats.push(seatNumber);
      }
      
      // Aisle space
      rowSeats.push('aisle');
      
      // Right side seats (C, D)
      for (let seatLetter of ['C', 'D']) {
        const seatNumber = `${row}${seatLetter}`;
        rowSeats.push(seatNumber);
      }
      
      seats.push(rowSeats);
    }
    
    return seats;
  };

  const seatLayout = generateSeatLayout();

  const isSeatOccupied = (seatNumber: string) => occupiedSeats.includes(seatNumber);
  const isSeatReserved = (seatNumber: string) => bus.reservedSeats.includes(seatNumber);
  const isSeatAvailable = (seatNumber: string) => 
    !isSeatOccupied(seatNumber) && !isSeatReserved(seatNumber);

  const handleSeatClick = (seatNumber: string) => {
    if (isSeatAvailable(seatNumber)) {
      onSeatSelect(seatNumber);
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Your Seat
        </Typography>
        
        <Stack spacing={3}>
          {/* Legend */}
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  bgcolor: 'background.paper', 
                  border: '2px solid',
                  borderColor: 'divider'
                }} 
              />
              <Typography variant="body2">Available</Typography>
            </Stack>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  bgcolor: 'primary.main' 
                }} 
              />
              <Typography variant="body2">Selected</Typography>
            </Stack>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  bgcolor: 'grey.300' 
                }} 
              />
              <Typography variant="body2">Occupied/Reserved</Typography>
            </Stack>
          </Stack>

          {/* Bus Layout */}
          <Box sx={{ maxWidth: 300, mx: 'auto' }}>
            {/* Driver Section */}
            <Box 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Driver
              </Typography>
            </Box>

            {/* Seat Grid */}
            <Stack spacing={1}>
              {seatLayout.map((row, rowIndex) => (
                <Stack key={rowIndex} direction="row" spacing={1} justifyContent="center">
                  {row.map((seat, seatIndex) => {
                    if (seat === 'aisle') {
                      return (
                        <Box 
                          key={seatIndex} 
                          sx={{ width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Box sx={{ width: 2, height: 20, bgcolor: 'divider' }} />
                        </Box>
                      );
                    }

                    const isOccupied = isSeatOccupied(seat);
                    const isReserved = isSeatReserved(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                      <SeatButton
                        key={seat}
                        isOccupied={isOccupied}
                        isReserved={isReserved}
                        isSelected={isSelected}
                        disabled={isOccupied || isReserved}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </SeatButton>
                    );
                  })}
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* Selected Seat Info */}
          {selectedSeat && (
            <Box sx={{ textAlign: 'center' }}>
              <Chip 
                label={`Selected Seat: ${selectedSeat}`}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Auto-assign option */}
          {onSkipSeatSelection && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onSkipSeatSelection}
                sx={{ mr: 2 }}
              >
                Auto-assign Seat
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Let the system automatically assign the next available seat
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SeatMap;