import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, TextField } from '@watch-it/ui';

const schema = z.object({ name: z.string().min(1, 'O nome não pode estar vazio.').max(80) });
type FormData = z.infer<typeof schema>;

interface EditNameDialogProps {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function EditNameDialog({ open, currentName, onClose, onConfirm }: EditNameDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: currentName } });

  useEffect(() => {
    if (open) reset({ name: currentName });
  }, [open, currentName, reset]);

  function handleClose() {
    reset();
    onClose();
  }

  function onSubmit({ name }: FormData) {
    onConfirm(name.trim());
    onClose();
  }

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '1.5rem', border: '2px solid', borderColor: 'divider' } }}
    >
      <DialogTitle sx={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, pb: 1 }}>
        Alterar Nome
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              id="edit-name"
              label="Nome"
              type="text"
              placeholder="Seu nome"
              register={register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button label="Cancelar" variant="ghost" onPress={handleClose} />
          <Button label="Salvar" type="submit" variant="primary" />
        </DialogActions>
      </Box>
    </MuiDialog>
  );
}
