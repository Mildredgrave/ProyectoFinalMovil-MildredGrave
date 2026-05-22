import { useState } from 'react'

interface NavigationProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onSearch: (query: string) => void
}

const categories = [
  { name: 'Todos' },
  { name: 'Limpieza' },
  { name: 'Tónicos' },
  { name: 'Sérums' },
  { name: 'Hidratantes' },
  { name: 'Protección Solar' },
  { name: 'Mascarillas' },
  { name: 'Tratamientos' },
]

export default function Navigation({ selectedCategory, onCategoryChange, onSearch }: NavigationProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch(value)
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        
        <div className="flex gap-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium transition ${
                selectedCategory === category.name
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-700 hover:text-green-600'
              }`}
            >
              <span className="mr-2"></span>
              {category.name}
            </button>
          ))}
        </div>

        
        <div className="flex flex-col gap-4 border-t border-gray-200 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:border-green-500 w-full sm:w-auto"
          />
        </div>
      </div>
    </nav>
  )
}


