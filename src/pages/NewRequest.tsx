import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducts } from '../services/product.service'
import { createRequest } from '../services/request.service'
import type { Product } from '../types/product'

type ItemSelecionado = {
  product: Product
  quantity: number
  observation: string
}

function NewRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<ItemSelecionado[]>([])
  const [observation, setObservation] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProducts().then((data) => setProducts(data.filter((p) => p.active)))
  }, [])

  function addItem(product: Product) {
    setItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id)
      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, quantity: 1, observation: '' }]
    })
  }

  function removeItem(productId: number) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
    )
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id || items.length === 0) return
    setSaving(true)

    try {
      await createRequest({
        commandId: parseInt(id),
        observation,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          observation: i.observation,
          ingredients: [],
        })),
      })
      navigate(`/app/comandas/${id}`)
    } catch {
      alert('Erro ao criar pedido.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/app/comandas/${id}`)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold">Novo Pedido</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Produtos disponíveis */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Produtos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItem(product)}
                className="border rounded-lg p-3 text-left hover:border-orange-400 hover:bg-orange-50 transition-colors"
              >
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-orange-500 font-bold text-sm">
                  R$ {product.price.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Itens selecionados */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg">Itens Selecionados</h2>

          {items.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum item selecionado.</p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between gap-3 border-b pb-3">
                <span className="text-sm font-medium flex-1">{item.product.name}</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-bold w-20 text-right">
                  R$ {(item.product.price * item.quantity).toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Observação */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <label className="text-sm font-medium">Observação</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            rows={3}
            placeholder="Ex: sem cebola..."
          />
        </div>

        <button
          type="submit"
          disabled={saving || items.length === 0}
          className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  )
}

export default NewRequest