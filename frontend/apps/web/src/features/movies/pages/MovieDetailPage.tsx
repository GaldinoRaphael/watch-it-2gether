import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import MovieIcon from '@mui/icons-material/Movie';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RatingStars } from '@watch-it/ui';
import { useGroupVotes } from '../../groups/hooks/useGroupVotes';
import { useWatchedMovies } from '../../groups/hooks/useWatchedMovies';
import { useMovieSynopsis } from '../hooks/useMovieSynopsis';
import { useUserProfiles } from '../hooks/useUserProfiles';

export function MovieDetailPage() {
  const navigate = useNavigate();
  const { groupId, movieId } = useParams<{ groupId: string; movieId: string }>();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: watchedMovies, isLoading: moviesLoading } = useWatchedMovies(groupId);
  const { data: groupVotes, isLoading: votesLoading } = useGroupVotes(groupId);

  const movie = useMemo(
    () => watchedMovies?.find((m) => m.movieId === movieId),
    [watchedMovies, movieId],
  );

  const movieVotes = useMemo(
    () => groupVotes?.filter((v) => v.movieId === movieId) ?? [],
    [groupVotes, movieId],
  );

  const reviewerIds = useMemo(
    () => [...new Set(movieVotes.map((v) => v.userId))],
    [movieVotes],
  );

  const userNames = useUserProfiles(reviewerIds);

  const { data: synopsis, isLoading: synopsisLoading } = useMovieSynopsis(
    movie?.externalId,
    detailsOpen,
  );

  const isLoading = moviesLoading || votesLoading;

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 } }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: '1.25rem', mb: 3 }} />
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: '1rem' }} />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 } }}>
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          Filme não encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Back nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '9999px',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            bgcolor: 'background.paper',
            color: 'text.primary',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
            transition: 'transform 0.1s, border-bottom-width 0.1s',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          Detalhes do Filme
        </Typography>
      </Box>

      {/* Hero: poster + info */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { xs: 'center', sm: 'flex-start' } }}>

        {/* Poster */}
        <Box
          sx={{
            width: { xs: 160, sm: 200 },
            aspectRatio: '2 / 3',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '6px',
            bgcolor: 'action.disabledBackground',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            <MovieIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          )}
        </Box>

        {/* Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, width: '100%', textAlign: { xs: 'center', sm: 'left' } }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 800, lineHeight: 1.2 }}>
              {movie.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {movie.year?.match(/\d{4}/)?.[0]}
            </Typography>
          </Box>

          {/* Average rating card */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'divider',
              borderBottomWidth: '4px',
              borderRadius: '1rem',
              p: 2,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 0.5,
              width: 'fit-content',
              mx: { xs: 'auto', sm: 0 },
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Nota Média do Grupo
            </Typography>
            {movie.averageRating !== null ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RatingStars value={movie.averageRating} size="lg" readOnly />
                <Typography variant="h5" sx={{ color: 'tertiaryContainer', fontWeight: 800 }}>
                  {movie.averageRating.toFixed(1)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Nenhuma avaliação ainda
              </Typography>
            )}
          </Box>

          {/* Details button */}
          <Box
            component="button"
            type="button"
            onClick={() => setDetailsOpen(true)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.25,
              bgcolor: 'background.paper',
              color: 'text.primary',
              border: '2px solid',
              borderColor: 'divider',
              borderBottomWidth: '4px',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              width: { xs: '100%', sm: 'fit-content' },
              justifyContent: 'center',
              '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
              transition: 'transform 0.1s, border-bottom-width 0.1s',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
            Ver Detalhes do Filme
          </Box>
        </Box>
      </Box>

      {/* Reviews */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
            Avaliações dos Membros
          </Typography>
          <Box
            sx={{
              bgcolor: 'primaryFixed',
              border: '2px solid',
              borderColor: 'primaryContainer',
              borderRadius: '9999px',
              px: 1.5,
              py: 0.25,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'onPrimaryFixed' }}>
              {movieVotes.length} {movieVotes.length === 1 ? 'avaliação' : 'avaliações'}
            </Typography>
          </Box>
        </Box>

        {movieVotes.length === 0 ? (
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: '1rem',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Nenhuma avaliação ainda. Seja o primeiro!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {movieVotes.map((vote) => (
              <Box
                key={vote.id}
                sx={{
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: 'divider',
                  borderBottomWidth: '4px',
                  borderRadius: '1rem',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decor circle */}
                <Box sx={{ position: 'absolute', top: -16, right: -16, width: 48, height: 48, bgcolor: 'secondaryFixed', borderRadius: '9999px', opacity: 0.4 }} />

                {/* Reviewer */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '9999px',
                        bgcolor: 'secondaryContainer',
                        border: '2px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'onSecondaryContainer' }}>
                        {(userNames[vote.userId]?.[0] ?? '?').toUpperCase()}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                      {userNames[vote.userId] ?? '...'}
                    </Typography>
                  </Box>
                  <RatingStars value={vote.rating} size="sm" readOnly />
                </Box>

                {/* Commentary */}
                {vote.commentary ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', zIndex: 1 }}>
                    "{vote.commentary}"
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Details dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '1.25rem',
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800 }}>
          {movie.title}
          <IconButton onClick={() => setDetailsOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {synopsisLoading ? (
            <>
              <Skeleton variant="text" sx={{ mb: 1 }} />
              <Skeleton variant="text" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" />
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  Sinopse
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                  {synopsis?.synopsis || 'Sinopse não disponível.'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ bgcolor: 'background.default', border: '2px solid', borderColor: 'divider', borderRadius: '9999px', px: 1.5, py: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {movie.year?.match(/\d{4}/)?.[0]}
                  </Typography>
                </Box>
                {movie.provider && (
                  <Box sx={{ bgcolor: 'background.default', border: '2px solid', borderColor: 'divider', borderRadius: '9999px', px: 1.5, py: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {movie.provider}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
