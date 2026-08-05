import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Snackbar } from '@watch-it/ui';

export function GroupsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (location.state?.registered) {
      setToastOpen(true);
      // Clear state so refreshing doesn't re-show the toast
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  return (
    <>
      <Typography variant="h4">Meus Grupos</Typography>
      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Conta criada com sucesso! Bem-vindo(a) 🎬"
        severity="success"
      />
    </>
  );
}
