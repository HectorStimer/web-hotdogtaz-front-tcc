export type User = {
    id: number
    name: string
    email: string
    active: boolean
    createdAt: string
    type: 'admin' | 'clerk'
}