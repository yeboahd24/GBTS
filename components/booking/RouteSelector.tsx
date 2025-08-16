import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Autocomplete,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Search, SwapHoriz } from '@mui/icons-material';
import { useGetRoutesQuery, useGetTripsQuery } from '../../store/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Trip } from '../../types/schema';
import { formatCurrency, formatDuration, formatBusType } from '../../utils/formatters';

interface RouteSelectorProps {
  onTripSelect: (trip: Trip) => void;
}

const ghanaLocations = [
  'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Ho', 'Koforidua',
  'Sunyani', 'Wa', 'Bolgatanga', 'Techiman', 'Obuasi', 'Tema'
];

const RouteSelector: React.FC<RouteSelectorProps> = ({ onTripSelect }) => {
  const { selectedCompany } = useSelector((state: RootState) => state.auth);
  const [origin, setOrigin] = useState<string>('Accra');
  const [destination, setDestination] = useState<string>('Kumasi');
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  
  const { data: routes = [] } = useGetRoutesQuery(selectedCompany?.id);
  const { data: trips = [], isLoading: tripsLoading } = useGetTripsQuery({
    origin,
    destination,
    departureDate: departureDate.toISOString().split('T')[0],
  });

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    // Trigger refetch by updating the query params
    // This is handled automatically by RTK Query when params change
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        {/* Search Form */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Routes
            </Typography>
            
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <Autocomplete
                  value={origin}
                  onChange={(_, newValue) => setOrigin(newValue || '')}
                  options={ghanaLocations}
                  renderInput={(params) => (
                    <TextField {...params} label="From" fullWidth />
                  )}
                  sx={{ flex: 1 }}
                />
                
                <Button
                  onClick={handleSwapLocations}
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
                    <TextField {...params} label="To" fullWidth />
                  )}
                  sx={{ flex: 1 }}
                />
                
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue || new Date())}
                  minDate={new Date()}
                  sx={{ flex: 1 }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  sx={{ minHeight: 56 }}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Available Trips */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Trips
            </Typography>
            
            {tripsLoading ? (
              <Typography>Loading trips...</Typography>
            ) : trips.length === 0 ? (
              <Typography color="text.secondary">
                No trips available for the selected route and date.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {trips.map((trip) => (
                  <Card 
                    key={trip.id} 
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        boxShadow: 2,
                        borderColor: 'primary.main' 
                      }
                    }}
                    onClick={() => onTripSelect(trip)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6">
                            {trip.route?.origin} → {trip.route?.destination}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Departure: {trip.departureTime} • {trip.bus?.registrationNumber}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Chip 
                              label={formatBusType(trip.bus?.busType || 'standard')} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={`${trip.passengerSeatsAvailable} seats available`} 
                              size="small" 
                              color="success"
                            />
                          </Stack>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(trip.route?.baseFare || 0)}
                          </Typography>
                          <Button variant="contained" size="small" sx={{ mt: 1 }}>
                            Select
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </LocalizationProvider>
  );
};

export default RouteSelector;