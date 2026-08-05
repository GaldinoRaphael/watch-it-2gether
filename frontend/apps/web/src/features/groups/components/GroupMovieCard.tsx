import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieIcon from '@mui/icons-material/Movie';

interface GroupMovieCardProps {
  title: string;
  posterUrl: string | null;
}

export function GroupMovieCard({ title, posterUrl }: GroupMovieCardProps) {
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
    </Box>
  );
}
