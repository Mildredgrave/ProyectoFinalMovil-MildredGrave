export type SkinType = 'Grasa' | 'Seca' | 'Mixta' | 'Sensible' | 'Todos'

export type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  image: string
  stock: number
  skinType: SkinType
  step?: string
  ingredients?: string[]
  description?: string
  usageInstructions?: string | string[]
  ingredientBenefits?: string | string[]
}
