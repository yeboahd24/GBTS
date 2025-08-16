import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { loginUser } from './store/authSlice';
import { UserRole } from './types/enums';
import theme from './theme/theme';
import LoginForm from './components/auth/LoginForm';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './components/dashboard/Dashboard';
import BookingPage from './components/booking/BookingPage';
import CashierBookingForm from './components/booking/CashierBookingForm';
import ValidationPage from './components/validation/ValidationPage';

// Main App Component
const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, user } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (email: string, password: string) => {
    dispatch(loginUser({ email, password }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'booking':
        // Show different booking interface based on user role
        return isAuthenticated && user?.role === UserRole.CASHIER ? <CashierBookingForm /> : <BookingPage />;
      case 'validation':
        return <ValidationPage />;
      case 'analytics':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Analytics</Typography>
            <Typography>Analytics page coming soon...</Typography>
          </Box>
        );
      case 'companies':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Companies</Typography>
            <Typography>Company management coming soon...</Typography>
          </Box>
        );
      case 'fleet':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Fleet Management</Typography>
            <Typography>Fleet management coming soon...</Typography>
          </Box>
        );
      case 'users':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Users</Typography>
            <Typography>User management coming soon...</Typography>
          </Box>
        );
      case 'settings':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Settings</Typography>
            <Typography>Settings page coming soon...</Typography>
          </Box>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AppLayout>
  );
};

// Root App Component with Providers
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;