import api from './api'
import type { Command } from '../types/command'

export async function getCommands(): Promise<Command[]> {
  const response = await api.get('/commands')
  return response.data.content
}

export async function getCommandById(id: number): Promise<Command> {
  const response = await api.get(`/commands/${id}`)
  return response.data
}

export async function createCommand(data: {
  number: number
  tableNumber: number
  observation: string
}): Promise<Command> {
  const response = await api.post('/commands', data)
  return response.data
}

export async function updateCommand(id: number, data: {
  number: number
  tableNumber: number
  observation: string
  status: string
}): Promise<Command> {
  const response = await api.put(`/commands/${id}`, data)
  return response.data
}

export async function getCommandsSummary(): Promise<{
  total: number
  open: number
  completed: number
}> {
  const response = await api.get('/commands')
  const commands: Command[] = response.data.content
  return {
    total: commands.length,
    open: commands.filter((c) => c.status !== 'COMPLETED').length,
    completed: commands.filter((c) => c.status === 'COMPLETED').length,
  }
}