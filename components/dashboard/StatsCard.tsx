import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  color: theme.palette.primary.contrastText,
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  },
}));

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'primary' 
}) => {
  const getGradient = () => {
    switch (color) {
      case 'secondary':
        return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
      case 'success':
        return 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
      case 'error':
        return 'linear-gradient(135deg, #f44336 0%, #e57373 100%)';
      default:
        return 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: getGradient(),
        color: 'white',
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 1 }}>
                {value}
              </Typography>
            </Box>
            {icon && (
              <Box sx={{ opacity: 0.8 }}>
                {icon}
              </Box>
            )}
          </Stack>
          
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatsCard;