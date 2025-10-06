'use client';

import { Button, Typography, Stack } from '@mui/material';
import { useCounterStore } from '@/store/useCounterStore';

export default function Counter() {
  const { count, increase, decrease } = useCounterStore();

  return (
    <Stack alignItems="center" spacing={2} sx={{ mt: 5 }}>
      <Typography variant="h4">Count: {count}</Typography>
      <Stack direction="row" spacing={2}>
        <Button onClick={increase} variant="contained" color="primary">+</Button>
        <Button onClick={decrease} variant="contained" color="secondary">-</Button>
      </Stack>
    </Stack>
  );
}
