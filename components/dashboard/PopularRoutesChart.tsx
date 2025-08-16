import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { AnalyticsData } from '../../types/schema';

interface PopularRoutesChartProps {
  data: AnalyticsData;
  title?: string;
}

const PopularRoutesChart: React.FC<PopularRoutesChartProps> = ({ 
  data, 
  title = 'Popular Routes' 
}) => {
  const chartData = data.popularRoutes.map((route, index) => ({
    id: index,
    value: route.bookings,
    label: route.route,
    color: ['#1976d2', '#ff9800', '#4caf50', '#f44336', '#9c27b0'][index % 5],
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        
        <Box sx={{ width: '100%', height: 300 }}>
          <PieChart
            series={[
              {
                data: chartData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                valueFormatter: (item) => `${item.value} bookings`,
              },
            ]}
            width={undefined}
            height={300}
            margin={{ right: 200 }}
            slotProps={{
              legend: {
                direction: 'vertical',
                position: { vertical: 'middle', horizontal: 'right' },
                padding: 0,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PopularRoutesChart;