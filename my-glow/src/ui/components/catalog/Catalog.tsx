import { useState } from 'react'
import ProductCard from '../product/ProductCard'

const products = [
  // LIMPIEZA
  {
    id: '1',
    name: 'Low pH Good Morning Gel Cleanser',
    brand: 'COSRX',
    category: 'Limpieza',
    price: 145.00,
    image: 'images/Low-pH-Good-Morning-Gel-Cleanser.png',
    stock: 20,
    skinType: 'Piel Grasa',
  },
  {
    id: '2',
    name: 'Centella Cleansing Foam',
    brand: 'Mixsoon',
    category: 'Limpieza',
    price: 170.00,
    image: 'images/Centella-Cleansing-Foam.png',
    stock: 16,
    skinType: 'Piel Mixta',
  },
  {
    id: '3',
    name: 'Rice Water Cleanser',
    brand: 'Beauty of Joseon',
    category: 'Limpieza',
    price: 180.00,
    image: 'images/Rice-Water-Cleanser.png',
    stock: 14,
    skinType: 'Piel Seca',
  },
  {
    id: '4',
    name: 'Defense Barrier Cleanser',
    brand: 'Purito',
    category: 'Limpieza',
    price: 195.00,
    image: 'images/Defense-Barrier-Cleanser.png',
    stock: 12,
    skinType: 'Piel Sensible',
  },
  {
    id: '5',
    name: 'Madagascar Centella Ampoule Foam',
    brand: 'Skin1004',
    category: 'Limpieza',
    price: 185.00,
    image: 'images/Madagascar-Centella-Ampoule-Foam.png',
    stock: 18,
    skinType: 'Piel Grasa',
  },
  {
    id: '6',
    name: 'Snail Mucin Cleanser',
    brand: 'COSRX',
    category: 'Limpieza',
    price: 175.00,
    image: 'images/Snail-Mucin-Cleanser.png',
    stock: 15,
    skinType: 'Piel Mixta',
  },

  // TÓNICOS
  {
    id: '7',
    name: 'Hydrium Watery Toner',
    brand: 'COSRX',
    category: 'Tónicos',
    price: 185.00,
    image: 'images/Hydrium-Watery-Toner.png',
    stock: 12,
    skinType: 'Piel Mixta',
  },
  {
    id: '8',
    name: 'Galactomyces Toner',
    brand: 'Mixsoon',
    category: 'Tónicos',
    price: 220.00,
    image: 'images/Galactomyces-Toner.png',
    stock: 13,
    skinType: 'Piel Seca',
  },
  {
    id: '9',
    name: 'Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    category: 'Tónicos',
    price: 215.00,
    image: 'images/Ginseng-Essence-Water.png',
    stock: 17,
    skinType: 'Piel Seca',
  },
  {
    id: '10',
    name: 'Centella Unscented Toner',
    brand: 'Purito',
    category: 'Tónicos',
    price: 210.00,
    image: 'images/Centella-Unscented-Toner.png',
    stock: 10,
    skinType: 'Piel Sensible',
  },
  {
    id: '11',
    name: 'Madagascar Centella Tone Brightening Toner',
    brand: 'Skin1004',
    category: 'Tónicos',
    price: 225.00,
    image: 'images/Madagascar-Centella-Tone-Brightening-Toner.png',
    stock: 13,
    skinType: 'Piel Mixta',
  },
  {
    id: '12',
    name: 'Propolis Synergy Toner',
    brand: 'COSRX',
    category: 'Tónicos',
    price: 230.00,
    image: 'images/Propolis-Synergy-Toner.png',
    stock: 11,
    skinType: 'Piel Grasa',
  },

  // SÉRUMS
  {
    id: '13',
    name: 'Advanced Snail 96 Mucin Essence',
    brand: 'COSRX',
    category: 'Sérums',
    price: 210.00,
    image: 'images/Advanced-Snail-96-Mucin-Essence.png',
    stock: 18,
    skinType: 'Piel Seca',
  },
  {
    id: '14',
    name: 'Bean Essence',
    brand: 'Mixsoon',
    category: 'Sérums',
    price: 260.00,
    image: 'images/Bean-Essence.png',
    stock: 11,
    skinType: 'Piel Mixta',
  },
  {
    id: '15',
    name: 'Glow Deep Serum',
    brand: 'Beauty of Joseon',
    category: 'Sérums',
    price: 230.00,
    image: 'images/Glow-Deep-Serum.png',
    stock: 15,
    skinType: 'Piel Grasa',
  },
  {
    id: '16',
    name: 'Centella Unscented Serum',
    brand: 'Purito',
    category: 'Sérums',
    price: 235.00,
    image: 'images/Centella-Unscented-Serum.png',
    stock: 10,
    skinType: 'Piel Sensible',
  },
  {
    id: '17',
    name: 'Madagascar Centella Ampoule',
    brand: 'Skin1004',
    category: 'Sérums',
    price: 255.00,
    image: 'images/Madagascar-Centella-Ampoule.png',
    stock: 14,
    skinType: 'Piel Grasa',
  },
  {
    id: '18',
    name: 'Full Fit Propolis Serum',
    brand: 'COSRX',
    category: 'Sérums',
    price: 240.00,
    image: 'images/Full-Fit-Propolis-Serum.png',
    stock: 9,
    skinType: 'Piel Mixta',
  },

  // HIDRATANTES
  {
    id: '19',
    name: 'Balancium Comfort Ceramide Cream',
    brand: 'COSRX',
    category: 'Hidratantes',
    price: 240.00,
    image: 'images/Balancium-Comfort-Ceramide-Cream.png',
    stock: 14,
    skinType: 'Piel Seca',
  },
  {
    id: '20',
    name: 'Bean Cream',
    brand: 'Mixsoon',
    category: 'Hidratantes',
    price: 250.00,
    image: 'images/Bean-Cream.png',
    stock: 9,
    skinType: 'Piel Seca',
  },
  {
    id: '21',
    name: 'Dynasty Cream',
    brand: 'Beauty of Joseon',
    category: 'Hidratantes',
    price: 245.00,
    image: 'images/Dynasty-Cream.png',
    stock: 12,
    skinType: 'Piel Mixta',
  },
  {
    id: '22',
    name: 'B5 Panthenol Re-barrier Cream',
    brand: 'Purito',
    category: 'Hidratantes',
    price: 235.00,
    image: 'images/B5-Panthenol-Re-barrier-Cream.png',
    stock: 16,
    skinType: 'Piel Sensible',
  },
  {
    id: '23',
    name: 'Hyalu-Cica Moisture Cream',
    brand: 'Skin1004',
    category: 'Hidratantes',
    price: 255.00,
    image: 'images/Hyalu-Cica-Moisture-Cream.png',
    stock: 13,
    skinType: 'Piel Seca',
  },
  {
    id: '24',
    name: 'Oil-Free Ultra Moisturizing Lotion',
    brand: 'COSRX',
    category: 'Hidratantes',
    price: 220.00,
    image: 'images/Oil-Free-Ultra-Moisturizing-Lotion.png',
    stock: 18,
    skinType: 'Piel Grasa',
  },

  // PROTECCIÓN SOLAR
  {
    id: '25',
    name: 'Relief Sun Rice + Probiotics',
    brand: 'Beauty of Joseon',
    category: 'Protección Solar',
    price: 190.00,
    image: 'images/Relief-Sun-Rice-Probiotics.png',
    stock: 22,
    skinType: 'Piel Mixta',
  },
  {
    id: '26',
    name: 'Daily Soft Touch Sunscreen',
    brand: 'Purito',
    category: 'Protección Solar',
    price: 210.00,
    image: 'images/Daily-Soft-Touch-Sunscreen.png',
    stock: 18,
    skinType: 'Piel Sensible',
  },
  {
    id: '27',
    name: 'Hyalu-Cica Water-Fit Sun Serum',
    brand: 'Skin1004',
    category: 'Protección Solar',
    price: 240.00,
    image: 'images/Hyalu-Cica-Water-Fit-Sun-Serum.png',
    stock: 16,
    skinType: 'Piel Seca',
  },
  {
    id: '28',
    name: 'Aloe Soothing Sun Cream',
    brand: 'COSRX',
    category: 'Protección Solar',
    price: 200.00,
    image: 'images/Aloe-Soothing-Sun-Cream.png',
    stock: 20,
    skinType: 'Piel Grasa',
  },
  {
    id: '29',
    name: 'Cica Sun Essence',
    brand: 'Mixsoon',
    category: 'Protección Solar',
    price: 225.00,
    image: 'images/Cica-Sun-Essence.png',
    stock: 11,
    skinType: 'Piel Mixta',
  },
  {
    id: '30',
    name: 'Matte Sun Stick Mugwort',
    brand: 'Beauty of Joseon',
    category: 'Protección Solar',
    price: 215.00,
    image: 'images/Matte-Sun-Stick-Mugwort.png',
    stock: 15,
    skinType: 'Piel Grasa',
  },
]

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
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
          <h2 className="text-3xl font-bold">Protección Solar</h2>
          <p className="mt-2 text-green-100">Protege tu piel con nuestros productos de protección solar</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts
            .filter((p) => p.category === 'Protección Solar')
            .map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} user={user} />
            ))}
        </div>
      </section>

      
      <div className="my-12 border-t border-gray-200" />

      
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
    </div>
  )
}
