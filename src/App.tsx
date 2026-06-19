import { Navigate, Route, Routes } from 'react-router'

import { CommercialTransactionsPage } from '@/pages/commercial-transactions-page'
import { ContactPage } from '@/pages/contact-page'
import { DesignSystemPreview } from '@/pages/design-system-preview'
import { HomePage } from '@/pages/home-page'
import { NewsDetailPage } from '@/pages/news-detail-page'
import { NewsPage } from '@/pages/news-page'
import { ProductDetailPage } from '@/pages/product-detail-page'
import { ProductListPage } from '@/pages/product-list-page'

export function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<ProductListPage />} path="/items" />
      <Route element={<ProductDetailPage />} path="/items/:productId" />
      <Route element={<NewsPage />} path="/news" />
      <Route element={<NewsDetailPage />} path="/news/:newsId" />
      <Route element={<ContactPage />} path="/contact" />
      <Route element={<CommercialTransactionsPage />} path="/law" />
      <Route element={<DesignSystemPreview />} path="/design-system" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
