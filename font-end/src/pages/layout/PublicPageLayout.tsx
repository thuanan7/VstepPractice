import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const PublicPageLayout = () => {
  return (
    <Box flexDirection={'column'} display={'flex'}>
      <Box flex={1}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicPageLayout;
