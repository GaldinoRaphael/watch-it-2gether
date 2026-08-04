import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

export function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  return <Typography variant="h4">Filme {movieId}</Typography>;
}
