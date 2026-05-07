interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onContinueShopping: () => void
  user: { name: string; email: string } | null
  onCheckout: () => void
}

export default function Cart({ items, onRemove, onUpdateQuantity, onContinueShopping, user, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 inline-block text-5xl">🛒</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
        <p className="mb-6 text-gray-600">Explora nuestros productos de skincare y agrega los que te gusten.</p>
        <button
          onClick={onContinueShopping}
          className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Continuar comprando
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Tu Carrito</h1>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 text-3xl">
                {item.image.length <= 2 ? (
                  <span>{item.image}</span>
                ) : (
                  <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">Q{item.price.toFixed(2)} cada uno</p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">Q{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => onRemove(item.id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Resumen del pedido</h2>
        <div className="space-y-3 border-b border-gray-200 pb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal ({itemCount} items)</span>
            <span>Q{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Envío</span>
            <span className="text-emerald-600 font-semibold">¡Gratis!</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span className="text-green-600">Q{total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={!user}
          className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {!user ? 'Regístrate para proceder al pago' : 'Proceder al pago'}
        </button>
        <button
          onClick={onContinueShopping}
          className="mt-3 w-full rounded-lg border border-green-300 px-4 py-3 font-semibold text-green-600 transition hover:bg-green-50"
        >
          Continuar comprando
        </button>
      </aside>
    </div>
  )
}
