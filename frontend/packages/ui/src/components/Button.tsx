import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantMap = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
} as const;

export function Button({
  label,
  onPress,
  type = 'button',
  variant = 'primary',
  disabled,
  loading,
  fullWidth,
}: ButtonProps) {
  return (
    <MuiButton
      type={type}
      variant={variantMap[variant]}
      onClick={onPress}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
    >
      {label}
    </MuiButton>
  );
}
