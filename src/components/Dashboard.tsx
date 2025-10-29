'use client'
import React from 'react'
import { Stack } from '@mui/material'
import DivisionVisualizer from '@/components/DivisionVisualizer'

const Dashboard = () => {
  const divisionData = {
    Numbers: [630, 35] as const,
    Steps: [
      { Id: 0, D1: 63, D2: 35, Sum: 1, Hint: "Раздели 63 на 35", Side: "right" },
      { Id: 1, D1: 1, D2: 35, Sum: 35, Hint: "Умножь 1 на 35", Side: "left" },
      { Id: 2, D1: 63, D2: 35, Sum: 28, Hint: "Вычти из 63 число 35", Side: "left" },
      { Id: 3, D1: 28, D2: 0, Sum: 280, Hint: "Спусти цифру 0 вниз", Side: "left" },
      { Id: 4, D1: 280, D2: 35, Sum: 8, Hint: "Раздели 280 на 35", Side: "right" },
      { Id: 5, D1: 8, D2: 35, Sum: 280, Hint: "Умножь 8 на 35", Side: "left" },
      { Id: 6, D1: 280, D2: 280, Sum: 0, Hint: "Вычти из 280 число 280", Side: "left" },
    ],
    correctAnswer: 18,
  } as const;


  return (
    <Stack direction={'column'} alignItems="center" spacing={2} sx={{ mt: 5 }} >
      <DivisionVisualizer />
    </Stack >
  )
}

export default Dashboard