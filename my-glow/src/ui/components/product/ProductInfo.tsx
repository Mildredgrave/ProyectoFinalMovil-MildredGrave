import type { Product } from '../../../domain/product/product.type'

interface ProductInfoProps {
  products: Product[]
}

export default function ProductInfo({ products }: ProductInfoProps) {
  if (products.length === 0) {
    return <p className="text-sm text-slate-600">No hay productos disponibles en este momento.</p>
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <article key={product.id} className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{product.brand}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">Stock {product.stock}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
            <span className="rounded-full bg-white px-3 py-1">{product.skinType}</span>
            {product.step && <span className="rounded-full bg-white px-3 py-1">{product.step}</span>}
            {product.ingredients && product.ingredients.map((ingredient) => (
              <span key={ingredient} className="rounded-full bg-white px-3 py-1">{ingredient}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
