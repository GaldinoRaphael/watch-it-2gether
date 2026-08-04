import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" color="text.primary">
        Login
      </Typography>
    </Box>
  );
}
