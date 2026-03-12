import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById, updateProduct } from '../services/product.service'
import { getCategories } from '../services/category.service'
import type { Category } from '../types/category'
import { ArrowLeft, Loader2 } from 'lucide-react'

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [active, setActive] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories)

    if (id) {
      getProductById(parseInt(id)).then((product) => {
        setName(product.name ?? '')
        setDescription(product.description ?? '')
        setPrice(product.price.toString() ?? '')
        setImageUrl(product.imageUrl ?? '')
        setCategoryId(product.category.id.toString())
        setActive(product.active)
      })
    }
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setLoading(true)

    try {
      await updateProduct(parseInt(id), {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        categoryId: parseInt(categoryId),
        ingredientId: [],
        active,
      })
      navigate('/app/cardapio')
    } catch {
      alert('Erro ao atualizar produto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/cardapio')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Produto</h1>
          <p className="text-sm text-gray-600">Atualize as informações do produto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-6">
        <div className="form-group">
          <label className="form-label">Nome do Produto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Preço (R$)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">URL da Imagem</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
          />
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x160?text=Imagem+Inválida'
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
          />
          <label htmlFor="active" className="form-label cursor-pointer">
            Produto disponível
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/app/cardapio')}
            className="btn-secondary flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct