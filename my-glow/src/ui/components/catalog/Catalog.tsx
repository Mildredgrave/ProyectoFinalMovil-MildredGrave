import { useEffect, useState } from 'react'
import ProductCard from '../product/ProductCard'
import { subscribeProductsRealtime, deleteProduct } from '../../../infraestructure/product/product.firestore'
import type { Product } from '../../../domain/product/product.type'
import type { User } from '../../../domain/user/user.type'

interface CatalogProps {
  searchQuery: string
  onAddToCart: (product: any) => void
  onEditProduct?: (product: Product) => void
  selectedCategory: string
  user: User | null
}

export default function Catalog({ searchQuery, onAddToCart, onEditProduct, selectedCategory, user }: CatalogProps) {
  const [selectedSkinType, setSelectedSkinType] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const unsubscribe = subscribeProductsRealtime(setProducts)
    return () => unsubscribe()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkinType = !selectedSkinType || product.skinType === selectedSkinType || product.skinType === 'Todos'
    const matchesCategory = !selectedCategory || selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesSkinType && matchesCategory
  })

  const handleDeleteProduct = async (productId: string) => {
    if (!user?.role || user.role !== 'admin') return
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      await deleteProduct(productId)
      alert('Producto eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar el producto')
    }
  }

  return (
    <div className="space-y-8">
      
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Todos nuestros productos</h2>
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedSkinType('')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !selectedSkinType
                ? 'bg-green-600 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-green-300'
            }`}
          >
            Todos los tipos de piel
          </button>
          {['Grasa', 'Seca', 'Mixta', 'Sensible'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSkinType(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedSkinType === type
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              Piel {type}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onEdit={onEditProduct}
                onDelete={handleDeleteProduct}
                user={user}
              />
            ))
          ) : (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Videos Educativos sobre Skincare</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/GOI8O94Uzxs"
              title="Retinoids: The Complete Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/v2tGVqhubLc"
              title="Retinoids Explained | Skincare 101"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/v2tGVqhubLc"
              title="Retinoids Explained | Skincare 101"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div><div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/fC_oHcQN7kY"
              title="Retinoids Explained | Skincare 101"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  )
}
