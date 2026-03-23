import api from './api'
import type { Category } from '../types/category'

export async function getCategories(): Promise<Category[]> {
  const response = await api.get('/categories')
  return response.data
}

export async function createCategory(data: { name: string }): Promise<Category> {
  const response = await api.post('/categories', data)
  return response.data
}

export async function updateCategory(id: number, data: { name: string }): Promise<Category> {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`)
}