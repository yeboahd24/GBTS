import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { Person, TrendingUp, Phone, Repeat } from '@mui/icons-material';

interface CustomerInsight {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface CustomerData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalBookings: number;
}

interface CustomerInsightsChartProps {
  data: CustomerData[];
  insights: CustomerInsight[];
  title?: string;
}

const CustomerInsightsChart: React.FC<CustomerInsightsChartProps> = ({ 
  data, 
  insights,
  title = 'Customer Insights' 
}) => {
  const dates = data.map(d => new Date(d.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }));
  const newCustomers = data.map(d => d.newCustomers);
  const returningCustomers = data.map(d => d.returningCustomers);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ fontSize: 16 }} />;
      case 'down': return <TrendingUp sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />;
      default: return null;
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        
        {/* Key Metrics */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {insights.map((insight, index) => (
            <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {insight.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {insight.metric}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5 }}>
                {getTrendIcon(insight.trend)}
                <Typography 
                  variant="caption" 
                  color={`${getTrendColor(insight.trend)}.main`}
                  sx={{ ml: 0.5 }}
                >
                  {insight.change > 0 ? '+' : ''}{insight.change}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Chart */}
        <Box sx={{ width: '100%', height: 250 }}>
          <LineChart
            xAxis={[
              {
                id: 'dates',
                data: dates,
                scaleType: 'point',
              },
            ]}
            series={[
              {
                id: 'new',
                label: 'New Customers',
                data: newCustomers,
                color: '#1976d2',
              },
              {
                id: 'returning',
                label: 'Returning Customers',
                data: returningCustomers,
                color: '#ff9800',
              },
            ]}
            width={undefined}
            height={250}
            margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'top', horizontal: 'right' },
              },
            }}
          />
        </Box>

        {/* Customer Behavior Insights */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Chip
            icon={<Person />}
            label="Peak booking: 9-11 AM"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Phone />}
            label="Mobile bookings: 78%"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Repeat />}
            label="Repeat rate: 65%"
            size="small"
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CustomerInsightsChart;