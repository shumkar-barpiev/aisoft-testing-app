'use client'
import React from 'react'
import { Stack } from '@mui/material'
import { questionData } from '@/data/data'
import DivisionVisualizer from '@/components/DivisionVisualizer'


const Dashboard = () => {


  return (
    <Stack direction={'column'} alignItems="center" spacing={2} sx={{ mt: 5 }} >
      <DivisionVisualizer data={questionData} />
    </Stack >
  )
}

export default Dashboard