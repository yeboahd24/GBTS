import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { EventSeat, TrendingUp, TrendingDown } from '@mui/icons-material';

interface SeatUtilizationData {
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  utilizationRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface SeatUtilizationChartProps {
  data: SeatUtilizationData;
  title?: string;
}

const SeatUtilizationChart: React.FC<SeatUtilizationChartProps> = ({ 
  data, 
  title = 'Seat Utilization' 
}) => {
  const chartData = [
    {
      id: 0,
      value: data.occupiedSeats,
      label: 'Occupied',
      color: '#1976d2',
    },
    {
      id: 1,
      value: data.availableSeats,
      label: 'Available',
      color: '#e0e0e0',
    },
  ];

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down': return <TrendingDown sx={{ color: 'error.main' }} />;
      default: return <EventSeat sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Chip
              icon={getTrendIcon()}
              label={`${data.utilizationRate}%`}
              color={getTrendColor() as any}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  valueFormatter: (item) => `${item.value} seats`,
                  innerRadius: 40,
                  outerRadius: 80,
                },
              ]}
              width={200}
              height={200}
              margin={{ right: 5 }}
              slotProps={{
                legend: { hidden: true },
              }}
            />
          </Box>

          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Total Seats:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {data.totalSeats}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Occupied:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                {data.occupiedSeats}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Available:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {data.availableSeats}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SeatUtilizationChart;