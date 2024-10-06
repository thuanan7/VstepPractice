import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from '@mui/material/Link';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
export const MainListItems = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleGotoPage = (page: string) => {
    navigate(page);
  };
  const isActive = useCallback(
    (key: string = '/admin') => {
      if (key === '/admin') {
        return pathname === key;
      }
      return pathname !== '/admin';
    },
    [pathname],
  );
  return (
    <React.Fragment>
      <ListItemButton onClick={() => handleGotoPage('/admin')} selected={isActive()}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Websites" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const secondaryListItems = () => {
  const navigate = useNavigate();
  const handleGotoPage = () => {
    navigate('/admin/events');
  };
  return (
    <React.Fragment>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <Link style={{ textDecoration: 'none' }} onClick={handleGotoPage}>
          <ListItemText primary="Events" />
        </Link>
      </ListItemButton>
    </React.Fragment>
  );
};
