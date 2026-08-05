import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import { AddMovieCard } from '../components/AddMovieCard';
import { GroupMovieCard } from '../components/GroupMovieCard';
import { useGroup } from '../hooks/useGroup';
import { useWatchedMovies } from '../hooks/useWatchedMovies';

export function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading: groupLoading, isError: groupError } = useGroup(groupId);
  const { data: watchedMovies, isLoading: moviesLoading } = useWatchedMovies(groupId);

  const isLoading = groupLoading || moviesLoading;

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

  if (groupError || !group) {
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

        {watchedMovies?.map((movie) => (
          <GroupMovieCard
            key={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
          />
        ))}
      </Box>
    </Box>
  );
}
