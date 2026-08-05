import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, TextField, Alert } from '@watch-it/ui';
import { createGroupSchema, type CreateGroupFormData } from '../schemas/createGroupSchema';
import { useCreateGroup } from '../hooks/useGroups';
import { useAuth } from '../../../providers/AuthContext';

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateGroupDialog({ open, onClose, onSuccess }: CreateGroupDialogProps) {
  const { user } = useAuth();
  const { mutate: create, isPending, isError, reset } = useCreateGroup();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateGroupFormData>({ resolver: zodResolver(createGroupSchema) });

  function handleClose() {
    resetForm();
    reset();
    onClose();
  }

  const onSubmit = (data: CreateGroupFormData) => {
    if (!user) return;
    create(
      { name: data.name, ownerId: user.id },
      {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <MuiDialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '1.5rem', border: '2px solid', borderColor: 'divider' } }}
    >
      <DialogTitle sx={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, pb: 1 }}>
        Novo grupo
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isError && <Alert severity="error">Erro ao criar grupo. Tente novamente.</Alert>}
          <TextField
            id="group-name"
            label="Nome do grupo"
            placeholder="Ex: Noite de Terror"
            register={register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button label="Cancelar" variant="ghost" onPress={handleClose} />
          <Button label="Criar grupo" type="submit" variant="primary" loading={isPending} />
        </DialogActions>
      </Box>
    </MuiDialog>
  );
}
