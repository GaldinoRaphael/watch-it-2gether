import MuiAlert from '@mui/material/Alert';
import type { ReactNode } from 'react';

export interface AlertProps {
  severity: 'error' | 'warning' | 'info' | 'success';
  children: ReactNode;
}

export function Alert({ severity, children }: AlertProps) {
  return (
    <MuiAlert severity={severity} sx={{ borderRadius: '0.75rem' }}>
      {children}
    </MuiAlert>
  );
}
