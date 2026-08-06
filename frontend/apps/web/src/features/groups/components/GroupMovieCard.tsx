import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieIcon from '@mui/icons-material/Movie';
import { RatingStars } from '@watch-it/ui';

interface GroupMovieCardProps {
  title: string;
  posterUrl: string | null;
  averageRating: number | null;
  onPress?: () => void;
}

export function GroupMovieCard({ title, posterUrl, averageRating, onPress }: GroupMovieCardProps) {
  return (
    <Box
      component={onPress ? 'button' : 'div'}
      type={onPress ? 'button' : undefined}
      onClick={onPress}
      sx={{
        width: '100%',
        border: '2px solid',
        borderColor: 'divider',
        borderBottomWidth: '4px',
        borderRadius: '1rem',
        p: 1,
        bgcolor: 'background.paper',
        cursor: onPress ? 'pointer' : 'default',
        transition: 'transform 150ms ease',
        '&:hover': onPress ? { transform: 'translateY(-2px)' } : {},
        '&:active': onPress ? { transform: 'translateY(2px)', borderBottomWidth: '2px' } : {},
        textAlign: 'left',
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {posterUrl ? (
          <Box
            component="img"
            src={posterUrl}
            alt={`Poster de ${title}`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <MovieIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        )}
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {title}
      </Typography>

      <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        {averageRating === null ? (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Sem avaliações
          </Typography>
        ) : (
          <RatingStars value={averageRating} size="sm" readOnly showLabel filledColor="warning.main" />
        )}
      </Box>
    </Box>
  );
}
