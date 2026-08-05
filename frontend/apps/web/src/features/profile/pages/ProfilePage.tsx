import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Snackbar } from '@watch-it/ui';
import { useAuth } from '../../../providers/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useUpdateName } from '../hooks/useUpdateName';
import { ProfileHeader } from '../components/ProfileHeader';
import { StatCard } from '../components/StatCard';
import { EditNameDialog } from '../components/EditNameDialog';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, totalRatings, isLoading, isError } = useProfile();
  const { nameOverride, updateName } = useUpdateName();

  const [editNameOpen, setEditNameOpen] = useState(false);
  const [devToastOpen, setDevToastOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const displayName = nameOverride ?? profile?.name ?? '';

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 480,
          mx: 'auto',
          px: 2.5,
          py: 6,
          gap: 3,
        }}
      >
        <Skeleton variant="circular" width={128} height={128} />
        <Skeleton variant="text" width={180} height={40} />
        <Skeleton variant="text" width={240} height={24} />
        <Skeleton variant="rounded" width="100%" height={88} sx={{ borderRadius: '1rem' }} />
        <Skeleton variant="rounded" width="100%" height={60} sx={{ borderRadius: '1rem' }} />
        <Skeleton variant="rounded" width="100%" height={60} sx={{ borderRadius: '1rem' }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          Não conseguimos carregar seu perfil.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        px: 2.5,
        py: { xs: 4, md: 6 },
      }}
    >
      <ProfileHeader
        name={displayName}
        email={profile.email}
        createdAt={profile.createdAt}
        onEditAvatar={() => setDevToastOpen(true)}
      />

      <Box sx={{ width: '100%', mb: 4 }}>
        <StatCard count={totalRatings} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <ActionButton
          icon={<PersonIcon sx={{ color: 'secondary.main' }} />}
          label="Alterar Nome"
          onPress={() => setEditNameOpen(true)}
        />
        <ActionButton
          icon={<PhotoCameraIcon sx={{ color: 'primary.main' }} />}
          label="Alterar Avatar"
          onPress={() => setDevToastOpen(true)}
        />

        <Divider sx={{ my: 0.5 }} />

        <DestructiveButton onPress={handleLogout} />
      </Box>

      <EditNameDialog
        open={editNameOpen}
        currentName={displayName}
        onClose={() => setEditNameOpen(false)}
        onConfirm={updateName}
      />

      <Snackbar
        open={devToastOpen}
        onClose={() => setDevToastOpen(false)}
        message="Em desenvolvimento 🚧"
        severity="info"
      />
    </Box>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <Box
      component="button"
      onClick={onPress}
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        border: '2px solid',
        borderColor: 'divider',
        borderBottomWidth: '4px',
        borderRadius: '1rem',
        px: 3,
        py: 1.75,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'transform 150ms ease, border-bottom-width 150ms ease, background-color 150ms ease',
        '&:hover': { bgcolor: 'action.hover' },
        '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px !important' },
      }}
    >
      {icon}
      <Typography
        variant="h6"
        sx={{ color: 'text.primary', flexGrow: 1, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
      >
        {label}
      </Typography>
      <ChevronRightIcon sx={{ color: 'text.disabled' }} />
    </Box>
  );
}

function DestructiveButton({ onPress }: { onPress: () => void }) {
  return (
    <Box
      component="button"
      onClick={onPress}
      sx={{
        width: '100%',
        bgcolor: 'error.light',
        border: '2px solid',
        borderColor: 'error.main',
        borderBottomWidth: '4px',
        borderRadius: '1rem',
        px: 3,
        py: 1.75,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'transform 150ms ease, border-bottom-width 150ms ease',
        '&:hover': { filter: 'brightness(0.97)' },
        '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px !important' },
      }}
    >
      <LogoutIcon sx={{ color: 'error.main' }} />
      <Typography
        variant="h6"
        sx={{ color: 'error.main', flexGrow: 1, fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
      >
        Sair
      </Typography>
    </Box>
  );
}
