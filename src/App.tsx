import { Navigate, Route, Routes } from 'react-router'

import { AdminLayout } from '@/components/admin-layout'
import { AdminCustomersPage } from '@/pages/admin-customers-page'
import { AdminDashboardPage } from '@/pages/admin-dashboard-page'
import { AdminInquiriesPage } from '@/pages/admin-inquiries-page'
import { AdminNewsPage } from '@/pages/admin-news-page'
import { AdminOrdersPage } from '@/pages/admin-orders-page'
import { AdminProductsPage } from '@/pages/admin-products-page'
import { AdminSettingsPage } from '@/pages/admin-settings-page'
import { CommercialTransactionsPage } from '@/pages/commercial-transactions-page'
import { ContactPage } from '@/pages/contact-page'
import { DesignSystemPreview } from '@/pages/design-system-preview'
import { HomePage } from '@/pages/home-page'
import { NewsDetailPage } from '@/pages/news-detail-page'
import { NewsPage } from '@/pages/news-page'
import { PrivacyPolicyPage } from '@/pages/privacy-policy-page'
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
      <Route element={<PrivacyPolicyPage />} path="/privacy" />
      <Route element={<DesignSystemPreview />} path="/design-system" />
      <Route element={<AdminLayout />} path="/admin">
        <Route index element={<AdminDashboardPage />} />
        <Route element={<AdminProductsPage />} path="products" />
        <Route element={<AdminOrdersPage />} path="orders" />
        <Route element={<AdminNewsPage />} path="news" />
        <Route element={<AdminCustomersPage />} path="customers" />
        <Route element={<AdminInquiriesPage />} path="inquiries" />
        <Route element={<AdminSettingsPage />} path="settings" />
        <Route element={<Navigate replace to="/admin" />} path="*" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}
