import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import { useGroupVotes } from '../../groups/hooks/useGroupVotes';
import { useWatchedMovies } from '../../groups/hooks/useWatchedMovies';
import { usePendingVotes } from '../hooks/usePendingVotes';
import { useSubmitVote } from '../hooks/useSubmitVote';
import type { WatchedMovie } from '@watch-it/domain';
import { RatingStars, Snackbar } from '@watch-it/ui';

export function PendingVotesPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  const { data: watchedMovies, isLoading: moviesLoading } = useWatchedMovies(groupId);
  const { data: groupVotes, isLoading: votesLoading } = useGroupVotes(groupId);
  const { mutate: submitVote, isPending } = useSubmitVote(groupId ?? '');

  const pendingMovies = usePendingVotes(watchedMovies, groupVotes, user?.id);

  // Freeze the list on first load — prevents blank screen when invalidateQueries shrinks pendingMovies mid-flow
  const [frozenList, setFrozenList] = useState<WatchedMovie[] | null>(null);

  const isLoading = moviesLoading || votesLoading;

  useEffect(() => {
    if (isLoading || frozenList !== null) return;
    if (pendingMovies.length === 0) {
      navigate(`/groups/${groupId}`, { replace: true });
    } else {
      setFrozenList(pendingMovies);
    }
  }, [isLoading, pendingMovies, frozenList, navigate, groupId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState<number>(0);
  const [commentary, setCommentary] = useState('');
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const movies = frozenList ?? [];
  const currentMovie = movies[currentIndex];
  const isLast = currentIndex === movies.length - 1;
  const progress = movies.length > 0 ? (currentIndex / movies.length) * 100 : 0;

  function advanceOrFinish() {
    if (isLast) {
      setSuccessOpen(true);
      setTimeout(() => navigate(`/groups/${groupId}`), 1800);
    } else {
      setCurrentIndex((i) => i + 1);
      setRating(0);
      setCommentary('');
    }
  }

  function handleSubmit() {
    if (!user?.id || !groupId || !currentMovie) return;
    submitVote(
      {
        userId: user.id,
        groupId,
        externalId: currentMovie.externalId,
        movieTitle: currentMovie.title,
        posterUrl: currentMovie.posterUrl ?? undefined,
        provider: currentMovie.provider ?? undefined,
        rating,
        commentary,
      },
      { onSuccess: advanceOrFinish },
    );
  }

  function handleSkip() {
    advanceOrFinish();
  }

  function handleExitConfirm() {
    navigate(`/groups/${groupId}`);
  }

  if (isLoading || !frozenList) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <LinearProgress sx={{ width: 200 }} />
      </Box>
    );
  }

  if (!currentMovie) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: 'background.default',
          zIndex: 50,
        }}
      >
        <Box
          component="button"
          type="button"
          aria-label="Fechar avaliações"
          onClick={() => setExitDialogOpen(true)}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '9999px',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            bgcolor: 'background.paper',
            color: 'text.primary',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            '&:active': { transform: 'translateY(4px)', borderBottomWidth: '0px' },
            transition: 'transform 0.1s, border-bottom-width 0.1s',
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            borderRadius: '9999px',
            px: 2,
            py: 0.5,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>
            {currentIndex + 1}&nbsp;/&nbsp;{pendingMovies.length}
          </Typography>
        </Box>
      </Box>

      {/* Main — scrollable area above fixed footer */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          pb: '200px',
          pt: '80px',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, textAlign: 'center' }}>
          Como foi o filme?
        </Typography>

        {/* Movie card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '6px',
            borderRadius: '1.25rem',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Poster */}
          <Box
            sx={{
              width: '100%',
              aspectRatio: '2 / 3',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '2px solid',
              borderColor: 'divider',
              bgcolor: 'action.disabledBackground',
            }}
          >
            {currentMovie.posterUrl ? (
              <Box
                component="img"
                src={currentMovie.posterUrl}
                alt={`Poster de ${currentMovie.title}`}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null}
          </Box>

          {/* Title + year */}
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.2 }}>
              {currentMovie.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {currentMovie.year?.match(/\d{4}/)?.[0] ?? ''}
            </Typography>
          </Box>

          <Box sx={{ width: '100%', height: '2px', bgcolor: 'divider', borderRadius: '9999px' }} />

          {/* Stars */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Sua nota
            </Typography>
            <RatingStars value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <Typography variant="h4" sx={{ color: 'tertiaryContainer', fontWeight: 800, lineHeight: 1 }}>
                {rating.toFixed(1)}
              </Typography>
            )}
          </Box>

          {/* Comment */}
          <TextField
            value={commentary}
            onChange={(e) => setCommentary(e.target.value)}
            placeholder="O que você achou? (opcional)"
            multiline
            minRows={3}
            fullWidth
            inputProps={{ maxLength: 500 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.75rem',
                bgcolor: 'background.default',
              },
            }}
          />
        </Box>
      </Box>

      {/* Fixed footer */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: '2px solid',
          borderColor: 'divider',
          borderRadius: '1rem 1rem 0 0',
          px: 2,
          pt: 1.5,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          zIndex: 50,
          boxShadow: '0 -10px 40px -15px rgba(0,0,0,0.15)',
        }}
      >
        {/* Progress */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', minWidth: 32 }}>
            {currentIndex + 1}/{movies.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              flex: 1,
              height: 12,
              borderRadius: '9999px',
              border: '2px solid',
              borderColor: 'divider',
              bgcolor: 'action.disabledBackground',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
                borderRadius: '9999px',
                transition: 'transform 500ms ease-out',
              },
            }}
          />
        </Box>

        {/* Primary action */}
        <Box
          component="button"
          type="button"
          disabled={rating === 0 || isPending}
          onClick={handleSubmit}
          sx={{
            width: '100%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            border: '2px solid',
            borderColor: 'primary.dark',
            borderBottomWidth: rating > 0 && !isPending ? '6px' : '2px',
            borderRadius: '0.75rem',
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontWeight: 800,
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: rating === 0 || isPending ? 'not-allowed' : 'pointer',
            opacity: rating === 0 || isPending ? 0.5 : 1,
            transition: 'transform 0.1s, border-bottom-width 0.1s, opacity 0.15s',
            '&:active': rating > 0 && !isPending
              ? { transform: 'translateY(6px)', borderBottomWidth: '0px' }
              : {},
          }}
        >
          {isLast ? 'Finalizar' : 'Avaliar e Próximo'}
          <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
        </Box>

        {/* Skip */}
        <Box
          component="button"
          type="button"
          onClick={handleSkip}
          sx={{
            width: '100%',
            py: 0.5,
            color: 'text.secondary',
            fontWeight: 800,
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            bgcolor: 'transparent',
            border: 'none',
            '&:hover': { color: 'text.primary' },
            transition: 'color 150ms',
          }}
        >
          Pular
        </Box>
      </Box>

      {/* Exit confirm dialog */}
      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '1rem', bgcolor: 'background.paper', border: '2px solid', borderColor: 'divider' } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Sair das avaliações?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Suas avaliações salvas serão mantidas. O progresso atual será perdido.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setExitDialogOpen(false)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: 'divider',
              borderBottomWidth: '4px',
              bgcolor: 'background.default',
              color: 'text.primary',
              fontWeight: 700,
              cursor: 'pointer',
              '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
            }}
          >
            Continuar
          </Box>
          <Box
            component="button"
            type="button"
            onClick={handleExitConfirm}
            sx={{
              px: 3,
              py: 1,
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: 'error.dark',
              borderBottomWidth: '4px',
              bgcolor: 'error.main',
              color: 'error.contrastText',
              fontWeight: 700,
              cursor: 'pointer',
              '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
            }}
          >
            Sair
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="Avaliações salvas!"
        severity="success"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
