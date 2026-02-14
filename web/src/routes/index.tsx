import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import VoteCounts from './overview/vote-counts'

// Index route: path is '/' per routeTree.gen.ts; TS may not see the augmentation

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
      <VoteCounts />
      <VoteCounts />
      <VoteCounts />
    </div>
  )
}
