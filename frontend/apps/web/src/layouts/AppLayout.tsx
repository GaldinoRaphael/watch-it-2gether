import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { matchPath, useLocation } from 'react-router-dom';
import { TopAppBar } from './TopAppBar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const { pathname } = useLocation();
  const isTaskFocusedRoute = Boolean(
    matchPath('/groups/:groupId/add-movie', pathname) ||
      matchPath('/groups/:groupId/add-movie/rate', pathname) ||
      matchPath('/groups/:groupId/pending-votes', pathname),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isTaskFocusedRoute && <TopAppBar />}
      <Box component="main" sx={{ flex: 1, pb: { xs: '80px', md: 0 } }}>
        <Outlet />
      </Box>
      {!isTaskFocusedRoute && <BottomNav />}
    </Box>
  );
}
