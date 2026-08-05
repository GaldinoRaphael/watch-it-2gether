import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';

interface MovieSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MovieSearchInput({ value, onChange }: MovieSearchInputProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        border: '2px solid',
        borderColor: 'divider',
        borderBottomWidth: '4px',
        borderRadius: '0.75rem',
        bgcolor: 'background.paper',
        px: 1.5,
        py: 1,
      }}
    >
      <SearchIcon sx={{ color: 'text.disabled' }} />
      <InputBase
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Qual filme adicionar?"
        inputProps={{ 'aria-label': 'Buscar filmes' }}
        sx={{
          flex: 1,
          fontSize: 17,
          color: 'text.primary',
          '& input::placeholder': { opacity: 1, color: 'text.disabled' },
        }}
      />
    </Box>
  );
}
