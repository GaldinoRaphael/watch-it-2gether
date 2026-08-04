import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function NotFoundPage() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" color="text.secondary">
        404 — Página não encontrada
      </Typography>
    </Box>
  );
}
