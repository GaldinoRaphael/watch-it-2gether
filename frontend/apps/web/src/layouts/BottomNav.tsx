import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';

const NAV_ITEMS = [
  { label: 'Grupos', path: '/groups', Icon: GroupsIcon },
  { label: 'Perfil', path: '/profile', Icon: PersonIcon },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        justifyContent: 'space-around',
        alignItems: 'center',
        px: 2,
        pb: 2,
        pt: 1,
        bgcolor: 'background.paper',
        borderTop: '2px solid',
        borderColor: 'divider',
        borderRadius: '1rem 1rem 0 0',
      }}
    >
      {NAV_ITEMS.map(({ label, path, Icon }) => {
        const active = pathname.startsWith(path);
        return (
          <Box
            key={path}
            component="button"
            onClick={() => navigate(path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              py: 1,
              borderRadius: '0.75rem',
              border: active ? '2px solid' : '2px solid transparent',
              borderColor: active ? 'divider' : 'transparent',
              borderBottomWidth: active ? '4px' : '2px',
              borderBottomColor: active ? 'primary.dark' : 'transparent',
              bgcolor: active ? 'primaryContainer' : 'transparent',
              color: active ? 'onPrimaryContainer' : 'text.secondary',
              cursor: 'pointer',
              transition: 'transform 100ms ease',
              '&:active': { transform: 'translateY(2px)' },
            }}
          >
            <Icon sx={{ fontSize: 24, mb: 0.25 }} />
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                fontSize: '0.75rem',
                lineHeight: 1,
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
