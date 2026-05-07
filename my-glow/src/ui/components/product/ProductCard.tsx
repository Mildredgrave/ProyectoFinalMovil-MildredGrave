interface ProductCardProps {
  product: any
  onAddToCart: (product: any) => void
  user: { name: string; email: string } | null
}

export default function ProductCard({ product, onAddToCart, user }: ProductCardProps) {
  const isEmoji = product.image.length <= 2;
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
          <span className={`text-xs font-medium ${
            product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0 || !user}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-300"
        >
          {product.stock === 0
            ? 'No disponible'
            : !user
            ? 'Regístrate para comprar'
            : 'Agregar al carrito'
          }
        </button>
      </div>
    </div>
  )
}
