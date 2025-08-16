import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  QrCodeScanner,
  CheckCircle,
  Error,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import TicketValidator from './TicketValidator';
import { Ticket } from '../../types/schema';

const ValidationPage: React.FC = () => {
  const [validationStats, setValidationStats] = useState({
    todayValidations: 0,
    successfulValidations: 0,
    failedValidations: 0,
  });

  const [recentValidations, setRecentValidations] = useState<Ticket[]>([]);

  const handleValidationComplete = (ticket: Ticket) => {
    setValidationStats(prev => ({
      ...prev,
      todayValidations: prev.todayValidations + 1,
      successfulValidations: prev.successfulValidations + 1,
    }));

    setRecentValidations(prev => [ticket, ...prev.slice(0, 4)]);
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'primary' | 'success' | 'error' | 'warning';
  }) => (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" color={`${color}.main`} sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Ticket Validation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Validate passenger tickets for boarding
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Today's Validations"
              value={validationStats.todayValidations}
              icon={<QrCodeScanner sx={{ fontSize: 40 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Successful"
              value={validationStats.successfulValidations}
              icon={<CheckCircle sx={{ fontSize: 40 }} />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Failed"
              value={validationStats.failedValidations}
              icon={<Error sx={{ fontSize: 40 }} />}
              color="error"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Validation Interface */}
          <Grid item xs={12} lg={8}>
            <TicketValidator onValidationComplete={handleValidationComplete} />
          </Grid>

          {/* Recent Validations */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Validations
                </Typography>
                
                {recentValidations.length === 0 ? (
                  <Alert severity="info">
                    No validations yet today
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {recentValidations.map((ticket, index) => (
                      <Card key={ticket.id} variant="outlined">
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {ticket.ticketCode}
                              </Typography>
                              <Chip 
                                label={ticket.status} 
                                size="small" 
                                color="success"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {ticket.passengerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Seat {ticket.seatNumber} • Just now
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                onClick={() => alert('Validation report would be generated here')}
              >
                Generate Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<Schedule />}
                onClick={() => alert('Trip status would be updated here')}
              >
                Update Trip Status
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ValidationPage;