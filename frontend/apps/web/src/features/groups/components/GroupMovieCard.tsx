import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface GroupMovieCardProps {
  title: string;
  posterUrl: string;
  rating: number;
}

export function GroupMovieCard({ title, posterUrl, rating }: GroupMovieCardProps) {
  return (
    <Box
      sx={{
        width: '100%',
        border: '2px solid',
        borderColor: 'divider',
        borderBottomWidth: '4px',
        borderRadius: '1rem',
        p: 1,
        bgcolor: 'background.paper',
        transition: 'transform 150ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '2 / 3',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '2px solid',
          borderColor: 'divider',
          mb: 1,
          bgcolor: 'background.default',
        }}
      >
        <Box
          component="img"
          src={posterUrl}
          alt={`Poster de ${title}`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ color: 'text.primary', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarIcon sx={{ fontSize: 16, color: 'tertiary.main' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    </Box>
  );
}
