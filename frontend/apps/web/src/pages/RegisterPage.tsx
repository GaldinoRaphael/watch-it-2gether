import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function RegisterPage() {
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
        Criar conta
      </Typography>
    </Box>
  );
}
