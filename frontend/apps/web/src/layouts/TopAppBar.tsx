import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MovieIcon from '@mui/icons-material/Movie';

const NAV_LINKS = [
  { label: 'Grupos', path: '/groups' },
  { label: 'Perfil', path: '/profile' },
];

export function TopAppBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        borderBottom: '2px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 2.5 }}>
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate('/groups')}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primaryContainer',
              borderRadius: '9999px',
              border: '2px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MovieIcon sx={{ fontSize: 22, color: 'onPrimaryContainer' }} />
          </Box>
          <Typography
            variant="h4"
            sx={{ color: 'primary.main', fontWeight: 800, fontSize: '1.25rem' }}
          >
            Watch It Together
          </Typography>
        </Box>

        {/* Desktop nav */}
        <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', mr: 1 }}>
          {NAV_LINKS.map(({ label, path }) => {
            const active = pathname.startsWith(path);
            return (
              <Box
                key={path}
                component="button"
                onClick={() => navigate(path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 2,
                  py: 1,
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  bgcolor: active ? 'primaryContainer' : 'transparent',
                  color: active ? 'onPrimaryContainer' : 'text.secondary',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  transition: 'background-color 150ms',
                  '&:hover': { bgcolor: active ? 'primaryContainer' : 'action.hover' },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        <IconButton sx={{ color: 'text.secondary' }} aria-label="Notificações">
          <NotificationsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
