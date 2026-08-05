import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { MovieSearchResult } from '@watch-it/domain';
import { Snackbar } from '@watch-it/ui';
import { useAuth } from '../../../providers/AuthContext';
import { useAddMovieToGroup } from '../hooks/useAddMovieToGroup';

interface RateMovieLocationState {
  movie?: MovieSearchResult;
}

export function RateMoviePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { groupId } = useParams<{ groupId: string }>();
  const [rating, setRating] = useState<number | null>(0);
  const [commentary, setCommentary] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Não foi possível salvar sua avaliação.');

  const movie = (location.state as RateMovieLocationState | null)?.movie;
  const safeGroupId = groupId ?? '';
  const { mutate: addMovieAndVote, isPending } = useAddMovieToGroup(safeGroupId);

  function handleSubmitVote() {
    if (!movie || !user?.id || !safeGroupId) {
      setErrorMessage('Não foi possível salvar sua avaliação.');
      setErrorOpen(true);
      return;
    }

    if (rating === null || rating < 0 || rating > 5) {
      setErrorMessage('A nota deve estar entre 0 e 5.');
      setErrorOpen(true);
      return;
    }

    addMovieAndVote(
      {
        userId: user.id,
        groupId: safeGroupId,
        externalId: movie.externalId,
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        rating,
        commentary,
      },
      {
        onSuccess: () => navigate(`/groups/${safeGroupId}`),
        onError: () => {
          setErrorMessage('Não foi possível salvar sua avaliação.');
          setErrorOpen(true);
        },
      },
    );
  }

  if (!movie) {
    return (
      <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', px: 2.5, py: { xs: 2, md: 4 } }}>
        <Typography variant="body1" sx={{ color: 'error.main', mb: 2 }}>
          Filme não selecionado. Volte para a busca e escolha um filme.
        </Typography>
        <Box
          component="button"
          type="button"
          onClick={() => navigate(`/groups/${safeGroupId}/add-movie`)}
          sx={{
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            borderRadius: '0.75rem',
            px: 2,
            py: 1,
            bgcolor: 'background.paper',
            cursor: 'pointer',
          }}
        >
          Voltar para busca
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', px: 2.5, py: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1.5,
          borderBottom: '2px solid',
          borderBottomColor: 'divider',
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => navigate(-1)}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '9999px',
            border: '2px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            color: 'text.secondary',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
          aria-label="Voltar"
        >
          <ArrowBackIcon />
        </Box>

        <Typography variant="h4" sx={{ color: 'primary.main', mx: 'auto', pr: 5 }}>
          Avaliar Filme
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: { xs: 128, md: 180 },
            height: { xs: 192, md: 270 },
            borderRadius: '0.75rem',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            overflow: 'hidden',
            bgcolor: 'background.paper',
          }}
        >
          {movie.posterUrl ? (
            <Box
              component="img"
              src={movie.posterUrl}
              alt={`Poster de ${movie.title}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </Box>

        <Typography variant="h5" sx={{ color: 'text.primary', textAlign: 'center', mt: 1 }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {movie.year?.match(/\d{4}/)?.[0] ?? 'Ano desconhecido'}
        </Typography>
      </Box>

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
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
          Sua Nota
        </Typography>
        <Rating
          name="movie-rating"
          value={rating}
          precision={0.5}
          onChange={(_, value) => setRating(value)}
          sx={{ '& .MuiRating-iconFilled': { color: 'tertiary.main' } }}
        />
        <Typography variant="h3" sx={{ color: 'tertiary.main', mt: 1 }}>
          {(rating ?? 0).toFixed(1)}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
          O que você achou do filme? (Opcional)
        </Typography>
        <TextField
          value={commentary}
          onChange={(event) => setCommentary(event.target.value)}
          placeholder="Escreva sua opinião..."
          multiline
          minRows={4}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem',
              bgcolor: 'background.paper',
            },
          }}
        />
      </Box>

      <Box
        component="button"
        type="button"
        onClick={() => setShowDetails((value) => !value)}
        sx={{
          width: { xs: '100%', md: 'auto' },
          alignSelf: { xs: 'stretch', md: 'center' },
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: '2px solid',
          borderColor: 'divider',
          borderBottomWidth: '4px',
          borderRadius: '0.75rem',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          cursor: 'pointer',
          '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
        }}
      >
        <ExpandMoreIcon
          sx={{
            transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        />
        Ver Detalhes Técnicos
      </Box>

      <Collapse in={showDetails}>
        <Box
          sx={{
            bgcolor: 'background.default',
            border: '2px solid',
            borderColor: 'divider',
            borderBottomWidth: '4px',
            borderRadius: '0.75rem',
            p: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Sinopse
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {movie.synopsis || 'Sinopse não disponível.'}
          </Typography>
        </Box>
      </Collapse>

      <Box
        component="button"
        type="button"
        disabled={isPending}
        onClick={handleSubmitVote}
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          color: 'common.white',
          border: '2px solid',
          borderColor: 'primary.dark',
          borderBottomWidth: '4px',
          borderRadius: '0.75rem',
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          fontWeight: 800,
          cursor: isPending ? 'default' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          '&:active': { transform: isPending ? 'none' : 'translateY(2px)', borderBottomWidth: '2px' },
        }}
      >
        Salvar Avaliação
        <CheckCircleIcon sx={{ fontSize: 20 }} />
      </Box>

      <Snackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMessage}
        severity="error"
      />
    </Box>
  );
}
