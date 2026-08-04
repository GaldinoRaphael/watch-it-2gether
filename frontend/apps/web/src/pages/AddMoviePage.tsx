import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export function AddMoviePage() {
  const { groupId } = useParams<{ groupId: string }>();
  return <Typography variant="h4">Adicionar filme ao grupo {groupId}</Typography>;
}
