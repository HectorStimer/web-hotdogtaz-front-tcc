export type RequestItem = {
  id: number
  product: {
    id: number
    name: string
    price: number
  }
  quantity: number
  unitPrice: number
  observation: string | null
}

export type Request = {
  id: number
  status: string
  observation: string | null
  orderDate: string
  commandId: number
  items: RequestItem[]
}