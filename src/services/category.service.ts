import axios from 'axios'
import type { Category } from '../types/category'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
})

export async function getCategories(): Promise<Category[]> {
  const response = await api.get('/categories')
  return response.data
}