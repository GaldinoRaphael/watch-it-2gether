import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';

type RatingStarsSize = 'sm' | 'lg';

export interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: RatingStarsSize;
  showLabel?: boolean;
  allowClear?: boolean;
  readOnly?: boolean;
  filledColor?: string;
  emptyColor?: string;
}

const STAR_COUNT = 5;

function clampRating(value: number): number {
  if (value < 0) return 0;
  if (value > STAR_COUNT) return STAR_COUNT;
  return Math.round(value * 2) / 2;
}

function getDisplayIcon(starNumber: number, value: number) {
  if (value >= starNumber) {
    return StarIcon;
  }

  if (value >= starNumber - 0.5) {
    return StarHalfIcon;
  }

  return StarBorderIcon;
}

export function RatingStars({
  value,
  onChange,
  size = 'sm',
  showLabel = false,
  allowClear = false,
  readOnly = false,
  filledColor = 'warning.main',
  emptyColor = 'action.disabledBackground',
}: RatingStarsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const iconSize = size === 'lg' ? 40 : 20;
  const gap = size === 'lg' ? 0.75 : 0.35;
  const currentValue = clampRating(value);
  const isInteractive = Boolean(onChange) && !readOnly;

  function getValueFromPointer(clientX: number): number {
    const container = containerRef.current;
    if (!container) return currentValue;

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = rect.width > 0 ? x / rect.width : 0;
    const raw = ratio * STAR_COUNT;
    const stepped = Math.ceil(raw * 2) / 2;
    return clampRating(stepped);
  }

  function updateValue(clientX: number) {
    if (!isInteractive || !onChange) return;
    const next = getValueFromPointer(clientX);

    if (allowClear && next === currentValue) {
      onChange(0);
      return;
    }

    onChange(next);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateValue(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isInteractive || !isDragging) return;
    updateValue(event.clientX);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isInteractive) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive || !onChange) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(clampRating(currentValue + 0.5));
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(clampRating(currentValue - 0.5));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      onChange(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      onChange(5);
    }
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Box
        ref={containerRef}
        role={isInteractive ? 'slider' : 'img'}
        aria-label={isInteractive ? 'Selecionar avaliação' : `Avaliação ${currentValue.toFixed(1)} de 5`}
        aria-valuemin={isInteractive ? 0 : undefined}
        aria-valuemax={isInteractive ? 5 : undefined}
        aria-valuenow={isInteractive ? currentValue : undefined}
        tabIndex={isInteractive ? 0 : -1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap,
          cursor: isInteractive ? (isDragging ? 'grabbing' : 'pointer') : 'default',
          touchAction: isInteractive ? 'none' : 'auto',
          userSelect: 'none',
        }}
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const starNumber = index + 1;
          const Icon = getDisplayIcon(starNumber, currentValue);

          return (
            <Icon
              key={starNumber}
              sx={{
                fontSize: iconSize,
                color: currentValue >= starNumber - 0.5 ? filledColor : emptyColor,
              }}
            />
          );
        })}
      </Box>

      {showLabel && (
        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 32, textAlign: 'left' }}>
          {currentValue.toFixed(1)}
        </Typography>
      )}
    </Box>
  );
}
