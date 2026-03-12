import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducts } from '../services/product.service'
import { createRequest } from '../services/request.service'
import type { Product } from '../types/product'
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import LoadingScreen from '../components/Loading'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.filter((p) => p.active)))
      .finally(() => setLoading(false))
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

  if (loading) return <LoadingScreen />

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/app/comandas/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Pedido</h1>
          <p className="text-sm text-gray-600">Selecione os produtos desejados</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Produtos disponíveis */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-6">Cardápio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addItem(product)}
                className="card-hover p-4 text-left group hover:border-orange-300"
              >
                <div className="aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  <img
                    src={product.imageUrl ?? 'https://placehold.co/400x160?text=Sem+Imagem'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</p>
                <p className="text-orange-600 font-bold text-sm mt-2">
                  R$ {product.price.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Itens selecionados */}
        <div className="card p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-6">
            {items.length > 0 ? `Itens Selecionados (${items.length})` : 'Nenhum item selecionado'}
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Selecione produtos no cardápio para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div 
                  key={item.product.id} 
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">R$ {item.product.price.toFixed(2)} cada</p>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Diminuir"
                    >
                      <Minus size={16} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Aumentar"
                    >
                      <Plus size={16} className="text-gray-600" />
                    </button>
                  </div>

                  <span className="font-bold text-gray-900 min-w-24 text-right">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {/* Total */}
              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">Total do Pedido</span>
                  <span className="text-2xl font-bold text-orange-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Observação */}
        <div className="card p-6">
          <label className="form-label block mb-3">Observações do Pedido</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Ex: sem cebola, temperado, bem quente..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/app/comandas/${id}`)}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || items.length === 0}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Confirmar Pedido
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewRequest