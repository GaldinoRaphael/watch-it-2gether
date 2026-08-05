import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieIcon from '@mui/icons-material/Movie';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import StarIcon from '@mui/icons-material/Star';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import type { Group } from '@watch-it/domain';

interface GroupCardProps {
  group: Group;
  index: number;
}

const ACCENTS = [
  { bg: 'secondaryContainer', color: 'onSecondaryContainer', blob: 'secondaryContainer', rotation: '-6deg' },
  { bg: 'primaryContainer', color: 'onPrimaryContainer', blob: 'primaryContainer', rotation: '3deg' },
  { bg: 'tertiaryContainer', color: 'onTertiaryContainer', blob: 'tertiaryContainer', rotation: '-3deg' },
] as const;

const ICONS = [MovieIcon, LocalPizzaIcon, FamilyRestroomIcon, StarIcon, OndemandVideoIcon];

export function GroupCard({ group, index }: GroupCardProps) {
  const navigate = useNavigate();
  const accent = ACCENTS[index % ACCENTS.length];
  const Icon = ICONS[index % ICONS.length];

  return (
    <Box
      onClick={() => navigate(`/groups/${group.id}`)}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '1.5rem',
        border: '2px solid',
        borderColor: 'divider',
        borderBottomWidth: '4px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 150ms ease, border-bottom-width 150ms ease',
        '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px !important' },
      }}
    >
      {/* Decorative blob */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -32,
          right: -32,
          width: 120,
          height: 120,
          bgcolor: accent.blob,
          opacity: 0.18,
          borderRadius: '0 0 0 9999px',
          pointerEvents: 'none',
        }}
      />

      {/* Icon container */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            bgcolor: accent.bg,
            borderRadius: '1rem',
            border: '2px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${accent.rotation})`,
          }}
        >
          <Icon sx={{ fontSize: 32, color: accent.color }} />
        </Box>
      </Box>

      {/* Name + subtitle */}
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', lineHeight: 1.3 }}>
          {group.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {group.movieCount > 0 ? `${group.movieCount} filmes` : 'Nenhum filme ainda'}
        </Typography>
      </Box>
    </Box>
  );
}
