import { useState } from 'react'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import Catalog from '../components/catalog/Catalog'
import Cart from '../components/cart/Cart'
import AccountPage from '../components/account/AccountPage'
import SkinQuiz from '../components/account/SkinQuiz'

function HomePage() {
  const [currentPage, setCurrentPage] = useState<'catalog' | 'cart' | 'account'>('catalog')
  const [cartItems, setCartItems] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [showSkinQuiz, setShowSkinQuiz] = useState(false)
  const [quizResult, setQuizResult] = useState<{ summary: string; routine: string[] } | null>(null)

  const handleAddToCart = (product: any) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCartItems((current) =>
      current.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const handleRegister = (newUser: { name: string; email: string }) => {
    setUser(newUser)
    setCurrentPage('catalog')
  }

  const handleLogout = () => {
    setUser(null)
    setCartItems([])
    setShowSkinQuiz(false)
    setQuizResult(null)
    setCurrentPage('catalog')
  }

  const handleSkinQuizClick = () => {
    if (!user) {
      setCurrentPage('account')
      return
    }
    setQuizResult(null)
    setShowSkinQuiz(true)
  }

  const handleQuizSubmit = (result: { summary: string; routine: string[] }) => {
    setQuizResult(result)
    setShowSkinQuiz(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8ff] via-white to-[#f7f4ff]">
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setCurrentPage('cart')}
        user={user}
        onAccountClick={() => setCurrentPage('account')}
        onSkinQuizClick={handleSkinQuizClick}
      />
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
            user={user}
          />
        )}
        {currentPage === 'cart' && (
          <Cart
            items={cartItems}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onContinueShopping={() => setCurrentPage('catalog')}
            user={user}
            onCheckout={() => alert('¡Compra realizada con éxito! Gracias por tu compra.')}
          />
        )}
        {currentPage === 'account' && (
          <AccountPage
            user={user}
            onRegister={handleRegister}
            onLogout={handleLogout}
            onBackToCatalog={() => setCurrentPage('catalog')}
          />
        )}
      </main>

      {/* Skin Quiz Modal */}
      {showSkinQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <SkinQuiz
              onSubmit={handleQuizSubmit}
              onCancel={() => setShowSkinQuiz(false)}
            />
          </div>
        </div>
      )}

      
      {quizResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Rutina recomendada</h3>
              <button
                onClick={() => setQuizResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-700">{quizResult.summary}</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {quizResult.routine.map((step, index) => (
                <li key={index} className="rounded-md bg-green-50 p-3">
                  <span className="font-medium">Paso {index + 1}:</span> {step}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setQuizResult(null)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
