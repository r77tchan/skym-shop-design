import { Navigate, Route, Routes } from 'react-router'

import { DesignSystemPreview } from '@/pages/design-system-preview'
import { HomePage } from '@/pages/home-page'

export function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<DesignSystemPreview />} path="/design-system" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
