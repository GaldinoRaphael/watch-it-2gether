import { useState } from 'react';
import MuiTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { RefCallback, ChangeEventHandler, FocusEventHandler } from 'react';

/** Structural match for react-hook-form UseFormRegisterReturn — no RHF import needed. */
interface FieldRegistration {
  name: string;
  ref: RefCallback<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface TextFieldProps {
  label: string;
  type?: 'text' | 'password' | 'email';
  register?: FieldRegistration;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  id?: string;
}

export function TextField({
  label,
  type = 'text',
  register,
  error,
  helperText,
  placeholder,
  fullWidth = true,
  id,
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const { ref: inputRef, ...restRegister } = register ?? ({} as FieldRegistration);

  return (
    <MuiTextField
      id={id}
      label={label}
      type={inputType}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant="outlined"
      inputRef={inputRef}
      InputProps={{
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShowPassword((v) => !v)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '1rem',
          '& fieldset': {
            borderWidth: '2px',
            borderBottomWidth: '4px',
          },
          '&:hover fieldset': {
            borderColor: 'divider',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'secondary.main',
            borderBottomColor: 'secondary.dark',
          },
        },
      }}
      {...restRegister}
    />
  );
}


