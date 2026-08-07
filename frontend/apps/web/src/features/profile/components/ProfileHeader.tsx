import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface ProfileHeaderProps {
  name: string;
  email: string;
  createdAt: string;
  onEditAvatar?: () => void;
}

function formatMemberSince(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(
    new Date(dateStr),
  );
}

export function ProfileHeader({ name, email, createdAt, onEditAvatar }: ProfileHeaderProps) {
  const memberSince = formatMemberSince(createdAt);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', mb: 4 }}>
      {/* Avatar */}
      <Box
        component="button"
        onClick={onEditAvatar}
        aria-label="Alterar avatar"
        sx={{
          position: 'relative',
          mb: 3,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          '&:active': { transform: 'translateY(2px)' },
          transition: 'transform 150ms ease',
        }}
      >
        <Box
          sx={{
            width: 128,
            height: 128,
            borderRadius: '9999px',
            border: '2px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: (t) => `0 6px 0 0 ${(t.palette as unknown as Record<string, unknown>)['outlineVariant'] as string ?? t.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 96, color: 'text.disabled' }} />
        </Box>

        {/* Edit badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 36,
            height: 36,
            borderRadius: '9999px',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            border: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: (t) => `0 2px 0 0 ${t.palette.primary.dark}`,
            fontSize: '1.1rem',
          }}
        >
          ✏️
        </Box>
      </Box>

      <Typography variant="h3" sx={{ color: 'text.primary', mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>
        {email}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1 }}>
        Membro desde {memberSince}
      </Typography>
    </Box>
  );
}
