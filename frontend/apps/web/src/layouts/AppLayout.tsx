import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { TopAppBar } from './TopAppBar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopAppBar />
      <Box component="main" sx={{ flex: 1, pb: { xs: '80px', md: 0 } }}>
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
}
