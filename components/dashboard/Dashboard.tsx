import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { TrendingUp, ConfirmationNumber, AttachMoney, Route } from '@mui/icons-material';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import PopularRoutesChart from './PopularRoutesChart';
import SeatUtilizationChart from './SeatUtilizationChart';
import CustomerInsightsChart from './CustomerInsightsChart';
import { useGetAnalyticsQuery } from '../../store/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { formatCurrency } from '../../utils/formatters';

const Dashboard: React.FC = () => {
  const { selectedCompany } = useSelector((state: RootState) => state.auth);
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery(selectedCompany?.id);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error || !analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Failed to load dashboard data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Stack spacing={3}>
        {/* Stats Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Today's Revenue"
              value={formatCurrency(analytics.todayRevenue)}
              subtitle="Revenue generated today"
              icon={<AttachMoney sx={{ fontSize: 40 }} />}
              color="success"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Today's Bookings"
              value={analytics.todayBookings}
              subtitle="Tickets booked today"
              icon={<ConfirmationNumber sx={{ fontSize: 40 }} />}
              color="primary"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Weekly Revenue"
              value={formatCurrency(analytics.weeklyRevenue)}
              subtitle="Revenue this week"
              icon={<TrendingUp sx={{ fontSize: 40 }} />}
              color="secondary"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <StatsCard
              title="Monthly Revenue"
              value={formatCurrency(analytics.monthlyRevenue)}
              subtitle="Revenue this month"
              icon={<Route sx={{ fontSize: 40 }} />}
              color="warning"
            />
          </Box>
        </Stack>

        {/* Charts */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Box sx={{ flex: 2 }}>
            <RevenueChart data={analytics} />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <PopularRoutesChart data={analytics} />
          </Box>
        </Stack>

        {/* Enhanced Analytics */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Box sx={{ flex: 1 }}>
            <SeatUtilizationChart 
              data={{
                totalSeats: 500,
                occupiedSeats: 387,
                availableSeats: 113,
                utilizationRate: 77,
                trend: 'up'
              }}
            />
          </Box>
          
          <Box sx={{ flex: 2 }}>
            <CustomerInsightsChart 
              data={analytics.dailyStats.map(stat => ({
                date: stat.date,
                newCustomers: Math.floor(stat.bookings * 0.3),
                returningCustomers: Math.floor(stat.bookings * 0.7),
                totalBookings: stat.bookings
              }))}
              insights={[
                { metric: 'New Customers', value: 156, trend: 'up', change: 12 },
                { metric: 'Returning', value: 234, trend: 'up', change: 8 },
                { metric: 'Retention Rate', value: 65, trend: 'stable', change: 0 }
              ]}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Dashboard;