import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import type { Vote } from '@watch-it/domain';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import { AddMovieCard } from '../components/AddMovieCard';
import { GroupInviteDialog } from '../components/GroupInviteDialog';
import { GroupMovieCard } from '../components/GroupMovieCard';
import { useGroup } from '../hooks/useGroup';
import { useGroupVotes } from '../hooks/useGroupVotes';
import { useWatchedMovies } from '../hooks/useWatchedMovies';

export function GroupDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading: groupLoading, isError: groupError } = useGroup(groupId);
  const { data: watchedMovies, isLoading: moviesLoading } = useWatchedMovies(groupId);
  const { data: groupVotes } = useGroupVotes(groupId);

  const isLoading = groupLoading || moviesLoading;

  const watchedCount = watchedMovies?.length ?? 0;
  const isOwner = group?.ownerId === user?.id;

  // Movies in this group that the current user hasn't rated yet
  const pendingCount = (() => {
    if (!watchedMovies || !groupVotes || !user) return 0;
    const ratedMovieIds = new Set(
      groupVotes.filter((v: Vote) => v.userId === user.id).map((v: Vote) => v.movieId),
    );
    return watchedMovies.filter((m) => !ratedMovieIds.has(m.movieId)).length;
  })();

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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2, mb: 3 }}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: '1.5rem' }} />
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: '1.5rem' }} />
        </Box>
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
    <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', px: 2.5, py: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Hero bento */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>

        {/* Group name card */}
        <Box
          sx={{
            bgcolor: 'secondaryContainer',
            borderRadius: '1.5rem',
            p: 4,
            border: '2px solid',
            borderColor: 'secondaryContainer',
            borderBottomWidth: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle radial highlight */}
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 100% 100%, #ffffff 10%, transparent 50%)', pointerEvents: 'none' }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              sx={{ color: 'onSecondaryContainer', mb: 1, wordBreak: 'break-word' }}
            >
              {group.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'onSecondaryContainer', opacity: 0.8 }}>
              {group.memberCount} {group.memberCount === 1 ? 'membro' : 'membros'}
            </Typography>

            {isOwner && (
              <Button
                variant="contained"
                onClick={() => setInviteDialogOpen(true)}
                startIcon={<GroupAddIcon />}
                sx={{
                  mt: 2,
                  bgcolor: 'background.paper',
                  color: 'secondary.dark',
                  textTransform: 'none',
                  fontWeight: 700,
                  border: '2px solid',
                  borderColor: 'background.paper',
                  borderBottomWidth: '4px',
                  '&:hover': { bgcolor: 'background.default' },
                  '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
                }}
              >
                Convidar amigos
              </Button>
            )}
          </Box>


        </Box>

        {/* Movies watched count card */}
        <Box
          sx={{
            bgcolor: 'tertiaryContainer',
            borderRadius: '1.5rem',
            p: 3,
            border: '2px solid',
            borderColor: 'tertiaryContainer',
            borderBottomWidth: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <LocalActivityIcon sx={{ fontSize: 80, color: 'onTertiaryContainer', opacity: 0.2, position: 'absolute', top: -12, right: -12 }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{ color: 'onTertiaryContainer', lineHeight: 1, fontSize: { xs: '3rem', md: '3.5rem' } }}
            >
              {watchedCount}
            </Typography>
            <Typography
              variant="overline"
              sx={{ color: 'onTertiaryContainer', opacity: 0.8, letterSpacing: '0.1em', mt: 1, display: 'block' }}
            >
              Filmes Vistos
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Pending mission card — only shown when there are unrated movies */}
      {pendingCount > 0 && (
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '1rem',
            border: '2px solid',
            borderColor: 'error.main',
            p: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Left accent bar */}
          <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: 'error.main' }} />

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'errorContainer',
              border: '2px solid',
              borderColor: 'error.main',
              borderBottomWidth: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0,
            }}
          >
            🍿
          </Box>

          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" sx={{ color: 'text.primary', mb: 0.5, fontSize: '1.25rem' }}>
              Missão Pendente!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Você tem{' '}
              <Box component="span" sx={{ fontWeight: 700, color: 'error.main' }}>
                {pendingCount} {pendingCount === 1 ? 'filme' : 'filmes'}
              </Box>{' '}
              para avaliar neste grupo.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(`/groups/${groupId}/pending-votes`)}
            sx={{
              borderRadius: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderBottomWidth: '4px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'error.dark',
              transition: 'all 0.1s ease-in-out',
              '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Avaliar Agora
          </Button>
        </Box>
      )}

      {/* Movie grid */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h3" sx={{ color: 'text.primary', fontSize: '1.25rem' }}>
            Atividade Recente
          </Typography>
        </Box>
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
              averageRating={movie.averageRating}
              onPress={() => navigate(`/groups/${groupId}/movie/${movie.movieId}`)}
            />
          ))}
        </Box>
      </Box>

      {groupId && (
        <GroupInviteDialog
          open={inviteDialogOpen}
          groupId={groupId}
          onClose={() => setInviteDialogOpen(false)}
        />
      )}
    </Box>
  );
}
