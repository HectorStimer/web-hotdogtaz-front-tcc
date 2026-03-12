import api from './api'
import type { User } from '../types/user'

export async function getUsers(): Promise<User[]> {
  const response = await api.get('/users')
  return response.data
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  type: 'ADMIN' | 'CLERK'
}): Promise<User> {
  const response = await api.post('/users', data)
  return response.data
}

export async function updateUser(id: number, data: {
  name: string
  email: string
  active: boolean
}): Promise<User> {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export async function deactivateUser(id: number): Promise<void> {
  await api.patch(`/users/${id}/deactivate`)
}