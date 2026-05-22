import type { User } from '../../../domain/user/user.type'

interface ProductCardProps {
  product: any
  onAddToCart: (product: any) => void
  onDelete?: (productId: string) => void
  onEdit?: (product: any) => void
  user: User | null
}

export default function ProductCard({ product, onAddToCart, onDelete, onEdit, user }: ProductCardProps) {
  const isEmoji = product.image.length <= 2;
  const isAdmin = user?.role === 'admin'
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
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
          <p className="text-lg font-bold text-green-600">Q{product.price.toFixed(2)}</p>
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
  )
}
