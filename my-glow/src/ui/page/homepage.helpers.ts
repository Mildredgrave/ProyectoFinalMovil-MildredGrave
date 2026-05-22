import type { Dispatch, SetStateAction } from 'react'
import { findUserByEmail } from '../../infraestructure/user/user.local'
import { findUserByEmailFirestore, createAdminIfNotExists } from '../../infraestructure/user/user.firestore'
import { updateProductStock } from '../../infraestructure/product/product.firestore'
import { saveOrderFirestore, subscribeOrdersRealtime, updateOrderStatusFirestore } from '../../infraestructure/order/order.firestore'
import type { Order, DeliveryInfo, PaymentInfo } from '../../domain/order/order.type'
import type { Product } from '../../domain/product/product.type'
import type { User } from '../../domain/user/user.type'

export type CartItem = Product & {
  quantity: number
}

export async function loadSavedUser(): Promise<User | null> {
  const savedEmail = localStorage.getItem('userEmail')
  if (!savedEmail) {
    return null
  }

  const localUser = findUserByEmail(savedEmail)
  if (localUser) {
    return localUser
  }

  const firebaseUser = await findUserByEmailFirestore(savedEmail)
  if (firebaseUser) {
    return firebaseUser
  }

  if (savedEmail === 'admin@myglow.com') {
    return {
      id: 'admin-001',
      name: 'Administrador',
      email: savedEmail,
      role: 'admin'
    }
  }

  localStorage.removeItem('userEmail')
  return null
}

export async function initializeUserSession(setUser: Dispatch<SetStateAction<User | null>>): Promise<void> {
  await createAdminIfNotExists()
  const savedUser = await loadSavedUser()
  if (savedUser) {
    setUser(savedUser)
  }
}

export function saveUserSession(user: User): void {
  localStorage.setItem('userEmail', user.email)
}

export function clearUserSession(): void {
  localStorage.removeItem('userEmail')
}

export function addToCart(current: CartItem[], product: Product): CartItem[] {
  const existing = current.find((item) => item.id === product.id)
  if (existing) {
    return current.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    )
  }
  return [...current, { ...product, quantity: 1 }]
}

export function removeFromCart(current: CartItem[], productId: string): CartItem[] {
  return current.filter((item) => item.id !== productId)
}

export function updateCartQuantity(current: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(current, productId)
  }

  return current.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  )
}

export function createOrder(
  cartItems: CartItem[],
  user: User,
  delivery: DeliveryInfo,
  payment: PaymentInfo
): Order {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return {
    id: Date.now().toString(),
    user,
    items: cartItems.map((item) => ({ product: item, quantity: item.quantity })),
    total,
    date: new Date(),
    status: 'pending',
    delivery,
    payment
  }
}

export async function checkoutCart(cartItems: CartItem[]): Promise<void> {
  for (const item of cartItems) {
    const newStock = item.stock - item.quantity
    await updateProductStock(item.id, newStock)
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await saveOrderFirestore(order)
}

export function subscribeOrders(onChange: (orders: Order[]) => void): () => void {
  return subscribeOrdersRealtime(onChange)
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  await updateOrderStatusFirestore(orderId, status)
}

