import type { Product } from '../types/product'
import { useNavigate } from 'react-router-dom'
import { deactivateProduct } from '../services/product.service'

type Props = {
  product: Product
  onDeactivate: (id: number) => void
}

function ProductCard({ product, onDeactivate }: Props) {
  const navigate = useNavigate()

  async function handleDeactivate() {
    if (!confirm('Deseja inativar este produto?')) return

    try {
      await deactivateProduct(product.id)
      onDeactivate(product.id)
    } catch {
      alert('Erro ao inativar produto.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
      <img
        src={product.imageUrl ?? 'https://placehold.co/400x160?text=Sem+Imagem'}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          product.active
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {product.active ? 'Disponível' : 'Indisponível'}
        </span>
      </div>

      <p className="text-sm text-gray-500">{product.description}</p>

      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-lg">
          R$ {product.price.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/app/cardapio/${product.id}`)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={handleDeactivate}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Inativar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard