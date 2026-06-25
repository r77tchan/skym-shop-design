import { adminOrders, type AdminOrder } from '@/lib/admin-orders'

export type AdminCustomer = {
  id: number
  email: string
  name: string
  orderCount: number
  totalSpent: string
  lastOrderId: number
  lastOrderedAt: string
}

export type AdminCustomerRow = {
  displayNo: number
  customer: AdminCustomer
}

export const adminCustomers: readonly AdminCustomer[] = [
  {
    id: 6,
    email: 'mizuki.tanaka@gmail.com',
    name: '田中 瑞希',
    orderCount: 4,
    totalSpent: '¥18,640',
    lastOrderId: 6,
    lastOrderedAt: '2026/06/20 10:42',
  },
  {
    id: 5,
    email: 'haruto.sato@gmail.com',
    name: '佐藤 陽翔',
    orderCount: 1,
    totalSpent: '¥1,280',
    lastOrderId: 5,
    lastOrderedAt: '2026/06/20 09:18',
  },
  {
    id: 4,
    email: 'yui.kobayashi@gmail.com',
    name: '小林 結衣',
    orderCount: 3,
    totalSpent: '¥8,420',
    lastOrderId: 4,
    lastOrderedAt: '2026/06/19 18:04',
  },
  {
    id: 3,
    email: 'ren.suzuki@gmail.com',
    name: '鈴木 蓮',
    orderCount: 1,
    totalSpent: '¥980',
    lastOrderId: 3,
    lastOrderedAt: '2026/06/19 16:27',
  },
  {
    id: 2,
    email: 'aoi.nakamura@gmail.com',
    name: '中村 葵',
    orderCount: 6,
    totalSpent: '¥32,700',
    lastOrderId: 2,
    lastOrderedAt: '2026/06/18 14:11',
  },
  {
    id: 1,
    email: 'sora.ito@gmail.com',
    name: '伊藤 空',
    orderCount: 2,
    totalSpent: '¥6,940',
    lastOrderId: 1,
    lastOrderedAt: '2026/06/18 11:35',
  },
]

export function getAdminCustomerRows(
  customers: ReadonlyArray<AdminCustomer> = adminCustomers,
): AdminCustomerRow[] {
  return customers.map((customer, index) => ({
    displayNo: index + 1,
    customer,
  }))
}

export function findAdminCustomerById(customerId?: string) {
  return adminCustomers.find((customer) => String(customer.id) === customerId)
}

export function getAdminCustomerOrders(customer: AdminCustomer): AdminOrder[] {
  return adminOrders.filter((order) => order.customerEmail === customer.email)
}
