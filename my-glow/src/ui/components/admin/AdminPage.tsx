import { useState, useEffect } from 'react'
import type { Order } from '../../../domain/order/order.type'
import type { Product } from '../../../domain/product/product.type'
import type { SkinType } from '../../../domain/product/product.type'
import { addProduct, deleteProduct, subscribeProductsRealtime, updateProduct } from '../../../infraestructure/product/product.firestore'

interface AdminPageProps {
  orders: Order[]
  editingProduct: Product | null
  onEditCompleted: () => void
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void
}

function AdminPage({ orders, editingProduct, onEditCompleted, onUpdateOrderStatus }: AdminPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProductState, setEditingProductState] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    image: '',
    stock: '',
    skinType: 'Todos' as SkinType,
    step: '',
    ingredients: '',
    description: '',
  })

  useEffect(() => {
    const unsubscribe = subscribeProductsRealtime(setProducts)
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!editingProduct) return

    setShowProductForm(true)
    setEditingProductState(editingProduct)
    setFormData({
      name: editingProduct.name,
      brand: editingProduct.brand,
      category: editingProduct.category,
      price: editingProduct.price.toString(),
      image: editingProduct.image,
      stock: editingProduct.stock.toString(),
      skinType: editingProduct.skinType,
      step: editingProduct.step || '',
      ingredients: editingProduct.ingredients?.join(', ') || '',
      description: editingProduct.description || '',
    })
  }, [editingProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.brand || !formData.category || !formData.price || !formData.image || !formData.stock) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)
    try {
      const productData = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        stock: parseInt(formData.stock),
        skinType: formData.skinType,
        step: formData.step || undefined,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : undefined,
        description: formData.description || undefined,
      }

      if (editingProductState) {
        await updateProduct(editingProductState.id, productData)
        alert('Producto actualizado exitosamente')
      } else {
        await addProduct(productData)
        alert('Producto agregado exitosamente')
      }

      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        image: '',
        stock: '',
        skinType: 'Todos',
        step: '',
        ingredients: '',
        description: '',
      })
      setShowProductForm(false)
      setEditingProductState(null)
      onEditCompleted()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert(
        'Error al guardar el producto: ' +
        (error instanceof Error ? error.message : 'Error desconocido')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(productId)
        alert('Producto eliminado exitosamente')
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        alert('Error al eliminar el producto')
      }
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
      
      {/* Sección de Productos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Productos</h2>
          <button
            onClick={() => setShowProductForm(!showProductForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {showProductForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        </div>

        {showProductForm && (
          <div className="bg-white border rounded-lg p-6 mb-6 shadow">
            <h3 className="text-lg font-semibold mb-4">{editingProductState ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Piel *</label>
                  <select
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Grasa">Grasa</option>
                    <option value="Seca">Seca</option>
                    <option value="Mixta">Mixta</option>
                    <option value="Sensible">Sensible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 border px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 border px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 border px-3 py-2"
                  rows={3}
                  placeholder="Separar por comas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 border px-3 py-2"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? 'Guardando...' : editingProductState ? 'Guardar cambios' : 'Guardar Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false)
                    setEditingProductState(null)
                    onEditCompleted()
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <p className="text-gray-500">No hay productos aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
                <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-600">Piel: {product.skinType}</p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-lg text-green-600">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowProductForm(true)
                        setEditingProductState(product)
                        setFormData({
                          name: product.name,
                          brand: product.brand,
                          category: product.category,
                          price: product.price.toString(),
                          image: product.image,
                          stock: product.stock.toString(),
                          skinType: product.skinType,
                          step: product.step || '',
                          ingredients: product.ingredients?.join(', ') || '',
                          description: product.description || '',
                        })
                      }}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Pedidos */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
        {orders.length === 0 ? (
          <p>No hay pedidos aún.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Pedido #{order.id}</p>
                    <p className="text-sm text-gray-600">Usuario: {order.user.name} ({order.user.email})</p>
                    <p className="text-sm text-gray-600">Fecha: {order.date.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Pago: {order.payment.method} {order.payment.cardNumberMasked}</p>
                    <p className="text-sm text-gray-600">Entrega: {order.delivery.address}, {order.delivery.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item: { product: Product; quantity: number }, index: number) => (
                    <p key={index} className="text-sm">
                      {item.product.name} x{item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage