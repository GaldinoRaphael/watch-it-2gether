import { createTheme, type PaletteMode } from '@mui/material/styles';
import { lightColors, darkColors, type CineQuestColorTokens } from './tokens/colors';
import { fontFamily } from './tokens/typography';

declare module '@mui/material/styles' {
  interface Palette {
    primaryContainer: string;
    onPrimaryContainer: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
  }
  interface PaletteOptions {
    primaryContainer?: string;
    onPrimaryContainer?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
  }
}

function buildTheme(c: CineQuestColorTokens, mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: c.primary,
        light: c.primaryContainer,
        dark: c.onPrimaryContainer,
        contrastText: c.onPrimary,
      },
      secondary: {
        main: c.secondary,
        light: c.secondaryContainer,
        dark: c.onSecondaryContainer,
        contrastText: c.onSecondary,
      },
      error: { main: c.error, contrastText: c.onError },
      warning: { main: c.warningYellow },
      info: { main: c.infoBlue },
      success: { main: c.successGreen },
      background: { default: c.background, paper: c.surfaceContainerLow },
      text: { primary: c.onSurface, secondary: c.onSurfaceVariant },
      divider: c.outlineVariant,
      primaryContainer: c.primaryContainer,
      onPrimaryContainer: c.onPrimaryContainer,
      secondaryContainer: c.secondaryContainer,
      onSecondaryContainer: c.onSecondaryContainer,
      tertiaryContainer: c.tertiaryContainer,
      onTertiaryContainer: c.onTertiaryContainer,
    },
    shape: { borderRadius: 12 },
    spacing: 8,
    typography: {
      fontFamily: fontFamily.body,
      h1: { fontFamily: fontFamily.display, fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' },
      h2: { fontFamily: fontFamily.display, fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2 },
      h3: { fontFamily: fontFamily.display, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2 },
      h4: { fontFamily: fontFamily.display, fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3 },
      h5: { fontFamily: fontFamily.display, fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.3 },
      h6: { fontFamily: fontFamily.display, fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 },
      body1: { fontFamily: fontFamily.body, fontSize: '1.0625rem', fontWeight: 500, lineHeight: 1.5 },
      body2: { fontFamily: fontFamily.body, fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 },
      button: { fontFamily: fontFamily.display, fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
      caption: { fontFamily: fontFamily.display, fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
      overline: { fontFamily: fontFamily.display, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'uppercase' as const,
            fontWeight: 800,
            letterSpacing: '0.05em',
            borderRadius: '0.75rem',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderBottomWidth: '4px',
            transition: 'transform 150ms ease, border-bottom-width 150ms ease',
            '&:active': {
              transform: 'translateY(2px)',
              borderBottomWidth: '2px',
            },
          },
        },
        variants: [
          { props: { variant: 'contained', color: 'primary' }, style: { borderColor: c.onPrimaryContainer } },
          { props: { variant: 'contained', color: 'secondary' }, style: { borderColor: c.onSecondaryContainer } },
          { props: { variant: 'outlined' }, style: { borderColor: c.outline } },
          { props: { variant: 'text' }, style: { borderColor: 'transparent', borderBottomColor: 'transparent' } },
        ],
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: '1rem',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: c.outlineVariant,
            borderBottomWidth: '4px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });
}

export function getTheme(mode: PaletteMode = 'light') {
  return buildTheme(mode === 'light' ? lightColors : darkColors, mode);
}

// Change argument to 'dark' here when dark mode is ready to ship
export const theme = getTheme('light');
