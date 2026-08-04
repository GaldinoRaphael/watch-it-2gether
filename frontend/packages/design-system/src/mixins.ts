import type { SxProps, Theme } from '@mui/material/styles';

// Standard 3D card: 2px border all sides, 4px bottom for physical depth
export const tactileCard: SxProps<Theme> = {
  border: '2px solid',
  borderColor: 'divider',
  borderBottomWidth: '4px',
  borderRadius: '1rem',
  transition: 'transform 150ms ease, border-bottom-width 150ms ease',
  '&:active': {
    transform: 'translateY(2px)',
    borderBottomWidth: '2px !important',
  },
};

// Larger-radius bento variant — use for dashboard main containers
export const bentoCard: SxProps<Theme> = {
  ...tactileCard,
  borderRadius: '1.5rem',
  p: 4,
  overflow: 'hidden',
  position: 'relative',
};

// Radial white shine — apply to position:relative containers for premium feel
export const shineOverlay: SxProps<Theme> = {
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.20) 0%, transparent 60%)',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  },
};

// Diagonal metallic shine for gamified progress bars (pair with position:relative overflow:hidden)
export const progressShine: SxProps<Theme> = {
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: '30%',
    height: '70%',
    background: 'rgba(255,255,255,0.40)',
    transform: 'skewX(-20deg)',
    borderRadius: '2px',
    pointerEvents: 'none',
  },
};
