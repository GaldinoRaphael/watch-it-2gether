import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Button, Snackbar } from '@watch-it/ui';
import { useCreateGroupInvite } from '../hooks/useGroupInvite';

interface GroupInviteDialogProps {
  open: boolean;
  groupId: string;
  onClose: () => void;
}

function resolveInviteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  return `${window.location.origin}/invite/${url}`;
}

export function GroupInviteDialog({ open, groupId, onClose }: GroupInviteDialogProps) {
  const [copyToastOpen, setCopyToastOpen] = useState(false);
  const [copyErrorToastOpen, setCopyErrorToastOpen] = useState(false);

  const {
    mutate: createInvite,
    data,
    isPending,
    isError,
    reset,
  } = useCreateGroupInvite(groupId);

  const inviteUrl = useMemo(() => {
    if (!data?.url) return '';
    return resolveInviteUrl(data.url);
  }, [data]);

  useEffect(() => {
    if (!open || inviteUrl || isPending) return;
    createInvite();
  }, [open, inviteUrl, isPending, createInvite]);

  function handleClose() {
    reset();
    onClose();
  }

  async function handleCopyLink() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyToastOpen(true);
    } catch {
      setCopyErrorToastOpen(true);
    }
  }

  return (
    <>
      <MuiDialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '1.5rem', border: '2px solid', borderColor: 'divider' } }}
      >
        <DialogTitle sx={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, pb: 1 }}>
          Convidar para o Grupo
        </DialogTitle>

        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Envie o link para convidar pessoas ao seu grupo.
          </Typography>

          {isError && <Alert severity="error">Não foi possível gerar o link de convite.</Alert>}

          {inviteUrl ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                value={inviteUrl}
                fullWidth
                InputProps={{ readOnly: true, startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <Button
                label="Copiar"
                onPress={handleCopyLink}
                variant="secondary"
              />
            </Box>
          ) : (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: '1rem',
                p: 2.5,
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <ContentCopyIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Nenhum link gerado ainda.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 1, pb: 1, gap: 1 }}>
          <Button label="Fechar" variant="ghost" onPress={handleClose} />
        </DialogActions>
      </MuiDialog>

      <Snackbar
        open={copyToastOpen}
        onClose={() => setCopyToastOpen(false)}
        message="Link copiado!"
        severity="success"
      />

      <Snackbar
        open={copyErrorToastOpen}
        onClose={() => setCopyErrorToastOpen(false)}
        message="Não foi possível copiar automaticamente. Copie manualmente."
        severity="warning"
      />
    </>
  );
}
