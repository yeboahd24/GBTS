import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { AnalyticsData } from '../../types/schema';
import { formatCurrency } from '../../utils/formatters';

interface RevenueChartProps {
  data: AnalyticsData;
  title?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  title = 'Daily Revenue Trends' 
}) => {
  const chartData = data.dailyStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    revenue: stat.revenue,
    bookings: stat.bookings,
  }));

  const dates = chartData.map(d => d.date);
  const revenues = chartData.map(d => d.revenue);
  const bookings = chartData.map(d => d.bookings);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ width: '100%', height: 300 }}>
          <BarChart
            xAxis={[
              {
                id: 'dates',
                data: dates,
                scaleType: 'band',
              },
            ]}
            series={[
              {
                id: 'revenue',
                label: 'Revenue (GH₵)',
                data: revenues,
                color: '#1976d2',
                valueFormatter: (value) => formatCurrency(value || 0),
              },
            ]}
            width={undefined}
            height={300}
            margin={{ left: 80, right: 20, top: 20, bottom: 60 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'top', horizontal: 'right' },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;