import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ListPage from './pages/ListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/list" replace />} />
        <Route path="list" element={<ListPage />} />
      </Route>
    </Routes>
  )
}

export default App
