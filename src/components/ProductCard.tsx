import type { Product } from '../types/product'
import { useNavigate } from 'react-router-dom'
import { deactivateProduct } from '../services/product.service'
import { Edit2, Trash2, Eye } from 'lucide-react'

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
    <div className="card-hover overflow-hidden flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
        <img
          src={product.imageUrl ?? 'https://placehold.co/400x160?text=Sem+Imagem'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
          <span className={`badge flex-shrink-0 ${
            product.active
              ? 'badge-success'
              : 'badge-danger'
          }`}>
            {product.active ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{product.description}</p>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            R$ {product.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/app/cardapio/${product.id}`)}
              className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-200"
              title="Editar"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDeactivate}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
              title="Inativar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard