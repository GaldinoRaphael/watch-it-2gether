import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
  anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
}

export function Snackbar({
  open,
  onClose,
  message,
  severity = 'success',
  autoHideDuration = 4000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
}: SnackbarProps) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ borderRadius: '0.75rem', width: '100%' }}
      >
        {message}
      </MuiAlert>
    </MuiSnackbar>
  );
}
