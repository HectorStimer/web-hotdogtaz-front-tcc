import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/product.service'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types/product'
import { Plus, AlertCircle } from 'lucide-react'
import LoadingScreen from '../components/Loading'

function Cardapio() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.filter((p) => p.active)))
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false))
  }, [])

  function handleDeactivate(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) return <LoadingScreen />
  if (error) return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="flex items-center gap-3 text-red-600 bg-red-50 px-6 py-3 rounded-lg border border-red-200">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{error}</span>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="section-title">Cardápio</h1>
          <p className="text-gray-600 text-sm">{products.length} produtos disponíveis</p>
        </div>
        <button
          onClick={() => navigate('/app/cardapio/novo')}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-medium">Nenhum produto disponível</p>
          <p className="text-sm">Comece adicionando um novo produto</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Cardapio