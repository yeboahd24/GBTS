import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  Analytics,
  Settings,
  Business,
  People,
  QrCodeScanner,
} from '@mui/icons-material';
import BentoOutlinedIcon from '@mui/icons-material/BentoOutlined';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { UserRole } from '../../types/enums';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, currentPage, onPageChange }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <BentoOutlinedIcon />,
      path: 'dashboard',
      roles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN, UserRole.CASHIER],
    },
    {
      text: 'Book Ticket',
      icon: <AirplaneTicketOutlinedIcon />,
      path: 'booking',
      roles: [UserRole.CASHIER, UserRole.COMPANY_ADMIN],
    },
    {
      text: 'Validate Tickets',
      icon: <QrCodeScanner />,
      path: 'validation',
      roles: [UserRole.CASHIER, UserRole.COMPANY_ADMIN],
    },
    {
      text: 'Analytics',
      icon: <PollOutlinedIcon />,
      path: 'analytics',
      roles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    },
    {
      text: 'Companies',
      icon: <Business />,
      path: 'companies',
      roles: [UserRole.ADMIN],
    },
    {
      text: 'Fleet Management',
      icon: <DirectionsBusFilledOutlinedIcon />,
      path: 'fleet',
      roles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    },
    {
      text: 'Users',
      icon: <People />,
      path: 'users',
      roles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    },
    {
      text: 'Settings',
      icon: <SettingsOutlinedIcon />,
      path: 'settings',
      roles: [UserRole.ADMIN, UserRole.COMPANY_ADMIN],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleItemClick = (path: string) => {
    onPageChange(path);
    onClose();
  };

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={currentPage === item.path}
              onClick={() => handleItemClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.path ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;