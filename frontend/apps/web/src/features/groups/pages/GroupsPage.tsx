import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import MovieIcon from '@mui/icons-material/Movie';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Snackbar } from '@watch-it/ui';
import { useGroups } from '../hooks/useGroups';
import { GroupCard } from '../components/GroupCard';
import { CreateGroupDialog } from '../components/CreateGroupDialog';

export function GroupsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupCreatedToast, setGroupCreatedToast] = useState(false);
  const { data: groups, isLoading, isError } = useGroups();
  const location = useLocation();
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(() => !!location.state?.registered);

  // Clear router state so refresh doesn't re-trigger
  if (location.state?.registered) {
    navigate(location.pathname, { replace: true, state: {} });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        px: 2.5,
        py: { xs: 4, md: 6 },
      }}
    >
      {/* Heading */}
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 600 }}>
        <Typography variant="h1" sx={{ color: 'text.primary', mb: 2 }}>
          Suas salas de cinema!
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Junte-se aos seus amigos, decida o que assistir e não perca a sequência!
        </Typography>
      </Box>

      {/* Create Group CTA */}
      <Box
        component="button"
        onClick={() => setDialogOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          bgcolor: 'primaryContainer',
          color: 'onPrimaryContainer',
          border: '2px solid transparent',
          borderBottom: '6px solid',
          borderBottomColor: 'primary.dark',
          borderRadius: '1rem',
          px: 4,
          py: 2,
          mb: 6,
          width: '100%',
          maxWidth: 448,
          cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: '1.25rem',
          fontWeight: 800,
          lineHeight: 1.2,
          transition: 'transform 100ms ease, border-bottom-width 100ms ease',
          '&:active': { transform: 'translateY(4px)', borderBottomWidth: '2px !important' },
        }}
      >
        <AddCircleIcon sx={{ fontSize: 32 }} />
        Criar Novo Grupo
      </Box>

      {/* States */}
      {isError && (
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          Não conseguimos carregar seus grupos.
        </Typography>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="rounded" height={180} sx={{ borderRadius: '1.5rem' }} />
          ))}
        </Box>
      )}

      {!isLoading && !isError && groups?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <MovieIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
          <Typography variant="h4" sx={{ color: 'text.secondary' }}>
            Você ainda não possui grupos.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 360 }}>
            Crie um grupo e comece a registrar os filmes que vocês assistem juntos.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button label="Criar grupo" variant="primary" onPress={() => setDialogOpen(true)} />
          </Box>
        </Box>
      )}

      {!isLoading && !isError && groups && groups.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          {groups.map((group, i) => (
            <GroupCard key={group.id} group={group} index={i} />
          ))}
        </Box>
      )}

      <CreateGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => setGroupCreatedToast(true)}
      />

      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Conta criada com sucesso! Bem-vindo(a) 🎬"
        severity="success"
      />

      <Snackbar
        open={groupCreatedToast}
        onClose={() => setGroupCreatedToast(false)}
        message="Grupo criado com sucesso! 🍿"
        severity="success"
      />
    </Box>
  );
}
