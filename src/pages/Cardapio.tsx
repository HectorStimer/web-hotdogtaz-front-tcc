import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/product.service'
import ProductCard from '../components/ProductCard'
import type { Product } from '../types/product'

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

  if (loading) return <p>Carregando...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cardápio</h1>
        <button
          onClick={() => navigate('/app/cardapio/novo')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>
    </div>
  )
}

export default Cardapio