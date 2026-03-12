import api from './api'
import type { Request } from '../types/request'

export async function getRequestsByCommand(commandId: number): Promise<Request[]> {
  const response = await api.get('/requests')
  return response.data.filter((r: Request) => r.commandId === commandId)
}

export async function getQueue(): Promise<Request[]> {
  const response = await api.get('/requests/queue')
  return response.data
}

export async function createRequest(data: {
  commandId: number
  observation: string
  items: {
    productId: number
    quantity: number
    observation: string
    ingredients: []
  }[]
}): Promise<Request> {
  const response = await api.post('/requests', data)
  return response.data
}

export async function updateRequestStatus(id: number, status: string): Promise<Request> {
  const response = await api.put(`/requests/${id}`, { status })
  return response.data
}