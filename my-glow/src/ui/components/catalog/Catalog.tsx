import { useState } from 'react'
import ProductCard from '../product/ProductCard'
import { products } from './products'



interface CatalogProps {
  searchQuery: string
  onAddToCart: (product: any) => void
  selectedCategory: string
  user: { name: string; email: string } | null
}

export default function Catalog({ searchQuery, onAddToCart, selectedCategory, user }: CatalogProps) {
  const [selectedSkinType, setSelectedSkinType] = useState<string>('')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkinType = !selectedSkinType || product.skinType === selectedSkinType || product.skinType === 'Todos'
    const matchesCategory = !selectedCategory || selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesSkinType && matchesCategory
  })

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

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} user={user} />)
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
