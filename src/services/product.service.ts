import api from './api'
import type { Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const response = await api.get('/products')
  return response.data.content
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
  ingredientId: number[]
}): Promise<Product> {
  const response = await api.post('/products', data)
  return response.data
}

export async function updateProduct(id: number, data: {
  name: string
  description: string
  price: number
  imageUrl: string
  categoryId: number
  ingredientId: number[]
  active: boolean
}): Promise<Product> {
  const response = await api.put(`/products/${id}`, data)
  return response.data
}

export async function deactivateProduct(id: number): Promise<void> {
  await api.patch(`/products/${id}/deactivate`)
}