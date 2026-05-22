import { useState } from 'react'
import type { User } from '../../../domain/user/user.type'
import type { Product } from '../../../domain/product/product.type'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onDelete?: (productId: string) => void
  onEdit?: (product: Product) => void
  user: User | null
}

export default function ProductCard({ product, onAddToCart, onDelete, onEdit, user }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const isEmoji = product.image?.length <= 2
  const isAdmin = user?.role === 'admin'

  return (
    <div
      className="relative w-full h-[420px] sm:h-[440px]"
      style={{
        perspective: '1200px',
      }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      onTouchStart={(e) => {
        e.preventDefault()
        setShowDetails((prev) => !prev)
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: showDetails ? 'rotateY(-180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-in-out',
          width: '100%',
        }}
        className="relative h-full w-full"
      >
        {/* Frente de la tarjeta */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="relative h-fullw-full "
        >
          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 text-5xl">
            {isEmoji ? (
              <span>{product.image}</span>
            ) : (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="space-y-3 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-1 text-xs text-gray-600">{product.brand}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-green-600">Q{product.price?.toFixed?.(2)}</p>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  product.stock > 10 ? 'bg-green-100 text-green-700' : 
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => onEdit?.(product)}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Editar producto
                </button>
              ) : (
                <button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0 || !user}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {product.stock === 0
                    ? 'No disponible'
                    : !user
                    ? 'Regístrate para comprar'
                    : 'Agregar al carrito'
                  }
                </button>
              )}
              {isAdmin && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(product.id)}
                  className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 overflow-auto rounded-lg bg-white p-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{product.name}</h3>
          
          {product.description && (
            <div className="mb-3 pb-2 border-b border-gray-200">
              <p className="text-xs text-gray-700 line-clamp-3">{product.description}</p>
            </div>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-900 mb-1">Ingredientes:</p>
              <ul className="text-xs text-gray-700 space-y-1">
                {product.ingredients.slice(0, 5).map((ingredient, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
