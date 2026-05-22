import type { Product } from '../product/product.type'
import type { User } from '../user/user.type'

export type DeliveryInfo = {
  recipientName: string
  address: string
  city: string
  postalCode: string
  phone: string
  notes?: string
}

export type PaymentInfo = {
  method: 'Credit Card' | 'Debit Card'
  cardHolder: string
  cardNumberMasked: string
  expiry: string
}

export type Order = {
  id: string
  user: User
  items: Array<{
    product: Product
    quantity: number
  }>
  total: number
  date: Date
  status: 'pending' | 'completed' | 'cancelled'
  delivery: DeliveryInfo
  payment: PaymentInfo
}
