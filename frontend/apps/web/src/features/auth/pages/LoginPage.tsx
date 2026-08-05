import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieIcon from '@mui/icons-material/Movie';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid decorative background */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          opacity: 0.08,
          pointerEvents: 'none',
          backgroundImage: (t) =>
            `radial-gradient(${t.palette.primaryContainer} 2px, transparent 2px)`,
          backgroundSize: '30px 30px',
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primaryContainer',
              borderRadius: '1rem',
              border: '2px solid',
              borderColor: 'onPrimaryContainer',
              borderBottomWidth: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          >
            <MovieIcon sx={{ fontSize: 48, color: 'primary.contrastText' }} />
          </Box>

          <Typography variant="h1" sx={{ color: 'primary.main', textAlign: 'center' }}>
            Watch It Together
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Vamos começar!
          </Typography>
        </Box>

        {/* Form */}
        <LoginForm />
      </Box>
    </Box>
  );
}
