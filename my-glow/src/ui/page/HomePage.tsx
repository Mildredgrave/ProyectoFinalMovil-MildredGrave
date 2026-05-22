import { useState, useEffect, lazy, Suspense } from 'react'

import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import Catalog from '../components/catalog/Catalog'

const Cart = lazy(() => import('../components/cart/Cart'))
const AccountPage = lazy(() => import('../components/account/AccountPage'))
const SkinQuiz = lazy(() => import('../components/account/SkinQuiz'))
const AdminPage = lazy(() => import('../components/admin/AdminPage'))

import type { CartItem } from './homepage.helpers'
import type { DeliveryInfo, PaymentInfo } from '../../domain/order/order.type'
import type { User } from '../../domain/user/user.type'
import type { Order } from '../../domain/order/order.type'
import type { Product } from '../../domain/product/product.type'

import { subscribeProductsRealtime } from '../../infraestructure/product/product.firestore'

import {
  initializeUserSession,
  saveUserSession,
  clearUserSession,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  createOrder,
  checkoutCart,
  saveOrder,
  subscribeOrders,
  updateOrderStatus,
} from './homepage.helpers'

import {
  loadCart,
  saveCart,
  clearCartLocal
} from '../../infraestructure/product/persistence'

function HomePage() {
  const [currentPage, setCurrentPage] = useState<
    'catalog' | 'cart' | 'account' | 'admin'
  >('catalog')

  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart())

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const [user, setUser] = useState<User | null>(null)

  const [orders, setOrders] = useState<Order[]>([])

  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  const [products, setProducts] = useState<Product[]>([])

  const [showSkinQuiz, setShowSkinQuiz] = useState(false)

  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    initializeUserSession(setUser)
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') {
      const unsubscribe = subscribeOrders(setOrders)
      return () => unsubscribe()
    }

    setOrders([])
  }, [user])

  useEffect(() => {
    const unsubscribe = subscribeProductsRealtime(setProducts)
    return () => unsubscribe()
  }, [])

  const getRecommendedProducts = (routine: string[]) => {
    const keywords = [
      { pattern: /limpiador|limpieza/i, category: 'Limpieza' },
      { pattern: /tónico/i, category: 'Tónicos' },
      { pattern: /s[eé]rum|serum|tratamiento/i, category: 'Sérums' },
      { pattern: /protector solar|spf/i, category: 'Protección Solar' },
      { pattern: /exfoliante|aha|bha/i, category: 'Tratamientos' },
      { pattern: /hidratante|crema/i, category: 'Hidratantes' },
      { pattern: /calmante|antirojeces|sensibilidad/i, category: 'Tratamientos' },
    ]

    const matchedCategories = new Set<string>()

    routine.forEach((step) => {
      keywords.forEach((item) => {
        if (item.pattern.test(step)) {
          matchedCategories.add(item.category)
        }
      })
    })

    const recommended: Product[] = []

    matchedCategories.forEach((category) => {
      const product = products.find(
        (item) =>
          item.category.toLowerCase() === category.toLowerCase() &&
          item.stock > 0
      )

      if (product) {
        recommended.push(product)
      }
    })

    if (recommended.length === 0) {
      return products
        .filter((item) => item.stock > 0)
        .slice(0, 3)
    }

    return recommended
  }

  const handleAddRecommendedProducts = (routine: string[]) => {
    const recommendedProducts = getRecommendedProducts(routine)

    if (recommendedProducts.length === 0) {
      setNotification(
        'No se encontraron productos recomendados. Puedes revisar el catálogo.'
      )
      return
    }

    setCartItems((current) => {
      let updatedCart = current

      recommendedProducts.forEach((product) => {
        updatedCart = addToCart(updatedCart, product)
      })

      return updatedCart
    })

    setNotification('Productos recomendados agregados al carrito.')
  }

  const handleAddToCart = (product: Product) => {
    setCartItems((current) => {
      const alreadyAdded = current.some(
        (item) => item.id === product.id
      )

      setNotification(
        alreadyAdded
          ? 'El producto ya se agregó al carrito.'
          : 'Producto agregado al carrito.'
      )

      return addToCart(current, product)
    })
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setCurrentPage('admin')
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((current) =>
      removeFromCart(current, productId)
    )
  }

  const handleUpdateQuantity = (
    productId: string,
    quantity: number
  ) => {
    setCartItems((current) =>
      updateCartQuantity(current, productId, quantity)
    )
  }

  const handleCheckout = async (
    payment: PaymentInfo,
    delivery: DeliveryInfo
  ) => {
    if (!user || cartItems.length === 0) return

    try {
      const newOrder = createOrder(
        cartItems,
        user,
        delivery,
        payment
      )

      await checkoutCart(cartItems)

      await saveOrder(newOrder)

      setOrders((prev) => [...prev, newOrder])

      setCartItems([])

      alert(
        '¡Compra realizada con éxito! Gracias por tu compra.'
      )
    } catch (error) {
      console.error('Error al procesar la compra:', error)

      alert(
        'Error al procesar la compra. Por favor intenta de nuevo.'
      )
    }
  }

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order['status']
  ) => {
    try {
      await updateOrderStatus(orderId, status)

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      )
    } catch (error) {
      console.error(
        'Error actualizando el estado del pedido:',
        error
      )

      alert(
        'No se pudo actualizar el estado del pedido.'
      )
    }
  }

  const handleRegister = (newUser: User) => {
    setUser(newUser)

    saveUserSession(newUser)

    setCurrentPage('catalog')
  }

  const handleLogout = () => {
    setUser(null)

    clearUserSession()

    setCartItems([])

    setShowSkinQuiz(false)

    setCurrentPage('catalog')
  }

  useEffect(() => {
    if (!user) {
      clearCartLocal()
    }
  }, [user])

  const handleSkinQuizClick = () => {
    if (!user) {
      setCurrentPage('account')
      return
    }

    setShowSkinQuiz(true)
  }

  const handleGoToCart = () => {
    setShowSkinQuiz(false)
    setCurrentPage('cart')
  }

  const handleQuizSubmit = (result: {
    summary: string
    routine: string[]
  }) => {
    console.log('Resultado del quiz:', result)

    setNotification('Rutina generada correctamente.')
  }

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

  useEffect(() => {
    if (!notification) return

    const timer = window.setTimeout(() => {
      setNotification(null)
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [notification])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8ff] via-white to-[#f7f4ff]">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCurrentPage('cart')}
        user={user}
        onAccountClick={() => setCurrentPage('account')}
        onSkinQuizClick={handleSkinQuizClick}
        onAdminClick={() => setCurrentPage('admin')}
      />

      {notification && (
        <div className="fixed right-4 top-24 z-50 max-w-xs rounded-2xl bg-emerald-600 px-4 py-3 text-sm text-white shadow-lg shadow-black/10">
          {notification}
        </div>
      )}

      <Navigation
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {currentPage === 'catalog' && (
          <Catalog
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart}
            onEditProduct={handleEditProduct}
            user={user}
          />
        )}

        {currentPage === 'cart' && (
          <Suspense
            fallback={
              <div className="py-8 text-center">
                Cargando carrito…
              </div>
            }
          >
            <Cart
              items={cartItems}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onContinueShopping={() =>
                setCurrentPage('catalog')
              }
              user={user}
              onCheckout={handleCheckout}
            />
          </Suspense>
        )}

        {currentPage === 'account' && (
          <Suspense
            fallback={
              <div className="py-8 text-center">
                Cargando cuenta…
              </div>
            }
          >
            <AccountPage
              user={user}
              onRegister={handleRegister}
              onLogout={handleLogout}
              onBackToCatalog={() =>
                setCurrentPage('catalog')
              }
            />
          </Suspense>
        )}

        {currentPage === 'admin' &&
          user?.role === 'admin' && (
            <Suspense
              fallback={
                <div className="py-8 text-center">
                  Cargando panel administrativo…
                </div>
              }
            >
              <AdminPage
                orders={orders}
                editingProduct={productToEdit}
                onEditCompleted={() =>
                  setProductToEdit(null)
                }
                onUpdateOrderStatus={
                  handleUpdateOrderStatus
                }
              />
            </Suspense>
          )}
      </main>

      {showSkinQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="h-full overflow-y-auto">
              <Suspense
                fallback={
                  <div className="py-8 text-center">
                    Cargando cuestionario…
                  </div>
                }
              >
                <SkinQuiz
                  onSubmit={handleQuizSubmit}
                  onCancel={() => setShowSkinQuiz(false)}
                  onAddRecommendedProducts={
                    handleAddRecommendedProducts
                  }
                  onGoToCart={handleGoToCart}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage