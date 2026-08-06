import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Snackbar } from '@watch-it/ui';
import { useAuth } from '../../../providers/AuthContext';
import { useAcceptGroupInvite, useGroupInvite } from '../hooks/useGroupInvite';
import { useState } from 'react';

export function InvitePage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { token: authToken } = useAuth();
  const [toastOpen, setToastOpen] = useState(false);

  const { data, isLoading, isError } = useGroupInvite(token);
  const { mutate: acceptInvite, isPending } = useAcceptGroupInvite(token);

  function handleAccept() {
    if (!authToken) {
      navigate('/login', { state: { redirectTo: `/invite/${token}` } });
      return;
    }

    acceptInvite(undefined, {
      onSuccess: (result) => {
        setToastOpen(true);
        navigate(`/groups/${result.groupId}`);
      },
    });
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2.5,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'divider',
          borderBottomWidth: '4px',
          borderRadius: '1.5rem',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          sx={{
            mx: 'auto',
            width: 72,
            height: 72,
            borderRadius: '1rem',
            bgcolor: 'secondaryContainer',
            color: 'onSecondaryContainer',
            border: '2px solid',
            borderColor: 'secondary.main',
            borderBottomWidth: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GroupIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant="h2" sx={{ color: 'text.primary' }}>
          Convite para grupo
        </Typography>

        {isLoading && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Carregando convite...
          </Typography>
        )}

        {isError && (
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            Esse convite não é válido ou não está mais disponível.
          </Typography>
        )}

        {!isLoading && !isError && data?.group && (
          <>
            <Typography variant="h4" sx={{ color: 'text.primary', mt: 0.5 }}>
              {data.group.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {data.group.numberOfMembers} {data.group.numberOfMembers === 1 ? 'membro' : 'membros'} atualmente
            </Typography>

            {!authToken && (
              <Alert severity="info">
                Você precisa estar logado para aceitar este convite. Após o login, você será redirecionado de volta automaticamente.
              </Alert>
            )}

            {!authToken ? (
              <Button
                label="Fazer login"
                variant="primary"
                onPress={() => navigate('/login', { state: { redirectTo: `/invite/${token}` } })}
              />
            ) : (
              <Button
                label="Aceitar convite"
                variant="primary"
                onPress={handleAccept}
                loading={isPending}
              />
            )}
          </>
        )}

        {authToken && (
          <Button
            label="Voltar para grupos"
            variant="ghost"
            onPress={() => navigate('/groups')}
          />
        )}
      </Box>

      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Você entrou no grupo com sucesso!"
        severity="success"
      />
    </Box>
  );
}
