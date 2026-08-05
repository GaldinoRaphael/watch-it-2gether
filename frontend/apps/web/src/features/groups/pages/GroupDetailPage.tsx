import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { AddMovieCard } from '../components/AddMovieCard';
import { GroupMovieCard } from '../components/GroupMovieCard';
import { useGroup } from '../hooks/useGroup';

const MOCK_MOVIES = [
  {
    id: 'movie-1',
    title: 'Duna: Parte 2',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    rating: 4.7,
  },
  {
    id: 'movie-2',
    title: 'Pobres Criaturas',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    rating: 4.5,
  },
  {
    id: 'movie-3',
    title: 'O Assassino',
    posterUrl: 'https://image.tmdb.org/t/p/w500/e7Jvsry47JJQruuezjU2X1Z6J77.jpg',
    rating: 3.8,
  },
];

export function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, isError } = useGroup(groupId);

  if (!groupId) {
    return (
      <Typography variant="body1" sx={{ color: 'error.main' }}>
        Grupo inválido.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 } }}>
        <Skeleton variant="text" width={240} height={48} sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="rounded" sx={{ width: '100%', aspectRatio: '2 / 3', borderRadius: '1rem' }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (isError || !group) {
    return (
      <Typography variant="body1" sx={{ color: 'error.main' }}>
        Não foi possível carregar o grupo.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: 'text.primary', mb: 3 }}>
        {group.name}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <AddMovieCard onPress={() => navigate(`/groups/${groupId}/add-movie`)} />

        {MOCK_MOVIES.map((movie) => (
          <GroupMovieCard
            key={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            rating={movie.rating}
          />
        ))}
      </Box>
    </Box>
  );
}
