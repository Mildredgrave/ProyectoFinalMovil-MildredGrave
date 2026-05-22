import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { User } from '../../../domain/user/user.type'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

type PaymentMethod = 'Credit Card' | 'Debit Card'

interface PaymentInfo {
  method: PaymentMethod
  cardHolder: string
  cardNumber: string
  expiry: string
  cvv: string
}

interface DeliveryInfo {
  recipientName: string
  address: string
  city: string
  postalCode: string
  phone: string
  notes: string
}

interface CartProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onContinueShopping: () => void
  user: User | null
  onCheckout: (payment: Omit<PaymentInfo, 'cvv' | 'cardNumber'> & { cardNumberMasked: string }, delivery: DeliveryInfo) => void
}

export default function Cart({ items, onRemove, onUpdateQuantity, onContinueShopping, user, onCheckout }: CartProps) {
  const [paymentData, setPaymentData] = useState<PaymentInfo>({
    method: 'Credit Card',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo>({
    recipientName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    notes: ''
  })
  const [checkoutError, setCheckoutError] = useState('')

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handlePaymentChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    const key = name as keyof PaymentInfo
    setPaymentData((prev) => ({ ...prev, [key]: value }))
    if (checkoutError) setCheckoutError('')
  }

  const handleDeliveryChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const key = name as keyof DeliveryInfo
    setDeliveryData((prev) => ({ ...prev, [key]: value }))
    if (checkoutError) setCheckoutError('')
  }

  const handleSubmit = () => {
    if (!user) return
    if (
      !paymentData.cardHolder ||
      !paymentData.cardNumber ||
      !paymentData.expiry ||
      !paymentData.cvv ||
      !deliveryData.recipientName ||
      !deliveryData.address ||
      !deliveryData.city ||
      !deliveryData.postalCode ||
      !deliveryData.phone
    ) {
      setCheckoutError('Por favor completa los datos de pago y entrega')
      return
    }

    const payment = {
      method: paymentData.method,
      cardHolder: paymentData.cardHolder,
      cardNumberMasked: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
      expiry: paymentData.expiry
    }

    onCheckout(payment, deliveryData)
  }

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
                <p className={`text-xs mt-1 ${item.quantity >= item.stock ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                  Stock disponible: {item.stock}
                </p>
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
                    disabled={item.quantity >= item.stock}
                    className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Datos de entrega</h3>
            <div className="mt-3 space-y-3">
              <input
                type="text"
                name="recipientName"
                value={deliveryData.recipientName}
                onChange={handleDeliveryChange}
                placeholder="Nombre del destinatario"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="text"
                name="address"
                value={deliveryData.address}
                onChange={handleDeliveryChange}
                placeholder="Dirección"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="text"
                name="city"
                value={deliveryData.city}
                onChange={handleDeliveryChange}
                placeholder="Ciudad"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="text"
                name="postalCode"
                value={deliveryData.postalCode}
                onChange={handleDeliveryChange}
                placeholder="Código postal"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="tel"
                name="phone"
                value={deliveryData.phone}
                onChange={handleDeliveryChange}
                placeholder="Teléfono"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <textarea
                name="notes"
                value={deliveryData.notes}
                onChange={handleDeliveryChange}
                placeholder="Notas de entrega (opcional)"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Método de pago</h3>
            <div className="mt-3 space-y-3">
              <select
                name="method"
                value={paymentData.method}
                onChange={handlePaymentChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Credit Card">Tarjeta de crédito</option>
                <option value="Debit Card">Tarjeta de débito</option>
              </select>
              <input
                type="text"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handlePaymentChange}
                placeholder="Nombre en la tarjeta"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="Número de tarjeta"
                maxLength={19}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="expiry"
                  value={paymentData.expiry}
                  onChange={handlePaymentChange}
                  placeholder="MM/AA"
                  className="rounded-md border border-gray-300 px-3 py-2"
                />
                <input
                  type="password"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  placeholder="CVV"
                  maxLength={4}
                  className="rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {checkoutError && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {checkoutError}
          </div>
        )}

        <button
          onClick={handleSubmit}
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
