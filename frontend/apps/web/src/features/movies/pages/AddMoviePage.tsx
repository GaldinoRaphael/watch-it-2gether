import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { MovieSearchResult } from '@watch-it/domain';
import { MovieSearchInput } from '../components/MovieSearchInput';
import { SearchResultItem } from '../components/SearchResultItem';
import { useMovieSearch } from '../hooks/useMovieSearch';

export function AddMoviePage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [query, setQuery] = useState('');

  const { data, isLoading, isError } = useMovieSearch(query);

  function handleSelectMovie(movie: MovieSearchResult) {
    if (!groupId) return;

    navigate(`/groups/${groupId}/add-movie/rate`, {
      state: {
        movie,
      },
    });
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 640, mx: 'auto', px: 2.5, py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
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
            border: 'none',
            bgcolor: 'transparent',
            color: 'text.secondary',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          aria-label="Voltar"
        >
          <ArrowBackIcon />
        </Box>

        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Buscar Filmes
        </Typography>
      </Box>

      <MovieSearchInput value={query} onChange={setQuery} />

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {query.trim().length < 2 && (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Digite o nome do filme para buscar.
          </Typography>
        )}

        {query.trim().length >= 2 && isLoading && (
          <>
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="rounded" height={108} sx={{ borderRadius: '0.75rem' }} />
            ))}
          </>
        )}

        {query.trim().length >= 2 && isError && (
          <Typography variant="body1" sx={{ color: 'error.main' }}>
            Erro ao buscar filmes.
          </Typography>
        )}

        {query.trim().length >= 2 && !isLoading && !isError && data?.length === 0 && (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Nenhum filme encontrado.
          </Typography>
        )}

        {query.trim().length >= 2 && !isLoading && !isError && data && data.length > 0 &&
          data.map((movie) => (
            <SearchResultItem
              key={movie.externalId}
              movie={movie}
              onPress={() => handleSelectMovie(movie)}
            />
          ))}
      </Box>
    </Box>
  );
}
