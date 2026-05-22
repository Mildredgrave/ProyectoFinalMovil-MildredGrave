import type { Product } from '../../domain/product/product.type'

export type CartItem = Product & { quantity: number }

// Local persistence keys
const CART_KEY = 'cart-v1'
const QUIZ_KEY = 'skinQuiz-v1'

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Error loading cart from localStorage', err)
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch (err) {
    console.error('Error saving cart to localStorage', err)
  }
}

export function clearCartLocal(): void {
  localStorage.removeItem(CART_KEY)
}

export function saveQuizResult(result: { summary: string; routine: string[] } | null): void {
  try {
    if (result) {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(result))
    } else {
      localStorage.removeItem(QUIZ_KEY)
    }
  } catch (err) {
    console.error('Error saving quiz result to localStorage', err)
  }
}

export function loadQuizResult(): { summary: string; routine: string[] } | null {
  try {
    const raw = localStorage.getItem(QUIZ_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Error loading quiz result from localStorage', err)
    return null
  }
}

export function clearQuizResult(): void {
  localStorage.removeItem(QUIZ_KEY)
}
