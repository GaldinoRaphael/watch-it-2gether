import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import { tactileCard } from '@watch-it/design-system';

interface StatCardProps {
  count: number;
}

export function StatCard({ count }: StatCardProps) {
  return (
    <Box
      sx={{
        ...tactileCard,
        bgcolor: 'background.paper',
        borderColor: 'divider',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          bgcolor: 'tertiaryContainer',
          borderRadius: '0.75rem',
          border: '2px solid',
          borderColor: 'onTertiaryContainer',
          borderBottomWidth: '3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <StarIcon sx={{ color: 'onTertiaryContainer', fontSize: 28 }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
          Total de Avaliações
        </Typography>
        <Typography variant="h3" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
          {count}
        </Typography>
      </Box>
    </Box>
  );
}
