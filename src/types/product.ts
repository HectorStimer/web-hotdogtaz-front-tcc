import type { Category } from './category'

export type Product = {
  id: number
  name: string
  description: string
  price: number
  active: boolean
  imageUrl: string | null
  category: Category
  ingredients: { id: number; name: string }[]
}