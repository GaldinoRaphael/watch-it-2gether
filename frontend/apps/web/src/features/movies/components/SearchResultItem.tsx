import AddIcon from '@mui/icons-material/Add';
import MovieIcon from '@mui/icons-material/Movie';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { MovieSearchResult } from '@watch-it/domain';

interface SearchResultItemProps {
  movie: MovieSearchResult;
  onPress: () => void;
  loading?: boolean;
}

function getMovieYearLabel(rawYear: string) {
  const match = rawYear.match(/\d{4}/);
  return match ? match[0] : 'Ano desconhecido';
}

export function SearchResultItem({ movie, onPress, loading }: SearchResultItemProps) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        p: 0.5,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 96,
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: '2px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        {movie.posterUrl ? (
          <Box
            component="img"
            src={movie.posterUrl}
            alt={`Poster de ${movie.title}`}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <MovieIcon sx={{ color: 'text.disabled' }} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {getMovieYearLabel(movie.year)}
        </Typography>
      </Box>

      <Box
        component="button"
        type="button"
        disabled={loading}
        onClick={onPress}
        sx={{
          width: 40,
          height: 40,
          borderRadius: '9999px',
          bgcolor: 'primary.main',
          color: 'common.white',
          border: '2px solid transparent',
          borderBottom: '4px solid',
          borderBottomColor: 'primary.dark',
          display: 'grid',
          placeItems: 'center',
          cursor: loading ? 'default' : 'pointer',
          transition: 'transform 100ms ease, opacity 100ms ease',
          opacity: loading ? 0.6 : 1,
          '&:active': {
            transform: loading ? 'none' : 'translateY(2px)',
          },
        }}
        aria-label={`Adicionar ${movie.title}`}
      >
        <AddIcon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}
