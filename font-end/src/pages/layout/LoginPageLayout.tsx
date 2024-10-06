import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Copyright } from '@/containers';

const LoginPageLayout = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Outlet />
      </Box>
      <Copyright />
    </Container>
  );
};

export default LoginPageLayout;
