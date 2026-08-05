import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface AddMovieCardProps {
  onPress: () => void;
}

export function AddMovieCard({ onPress }: AddMovieCardProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onPress}
      sx={{
        width: '100%',
        aspectRatio: '2 / 3',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: '1rem',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: 'text.secondary',
        cursor: 'pointer',
        transition: 'transform 150ms ease, background-color 150ms ease',
        '&:hover': { bgcolor: 'background.default' },
        '&:active': { transform: 'translateY(2px)' },
      }}
      aria-label="Adicionar novo filme"
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'divider',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <AddIcon sx={{ color: 'text.secondary' }} />
      </Box>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
        Adicionar novo
      </Typography>
    </Box>
  );
}
