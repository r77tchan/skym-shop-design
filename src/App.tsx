import { Navigate, Route, Routes } from 'react-router'

import { DesignSystemPreview } from '@/pages/design-system-preview'
import { HomePage } from '@/pages/home-page'
import { NewsDetailPage } from '@/pages/news-detail-page'
import { NewsPage } from '@/pages/news-page'

export function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<NewsPage />} path="/news" />
      <Route element={<NewsDetailPage />} path="/news/:newsId" />
      <Route element={<DesignSystemPreview />} path="/design-system" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
