import { useEffect, useState } from 'react'
import { useToast } from '../contexts/toast'
import { useConfirm } from '../contexts/confirm'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/category.service'
import { getProducts } from '../services/product.service'
import type { Category } from '../types/category'

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  function handleOpenCreate() {
    setEditing(null)
    setName('')
    setOpenModal(true)
  }

  function handleOpenEdit(category: Category) {
    setEditing(category)
    setName(category.name)
    setOpenModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, { name })
        setCategories((prev) => prev.map((c) => c.id === updated.id ? updated : c))
      } else {
        const created = await createCategory({ name })
        setCategories((prev) => [...prev, created])
      }
      setOpenModal(false)
      setName('')
    } catch {
      toast.show('Erro ao salvar categoria.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    // pré-cheque: impedir exclusão se houver produtos vinculados à categoria
    try {
      const products = await getProducts()
      const linked = products.some((p) => p.category?.id === id || p.categoryId === id)
      if (linked) {
        toast.show('Não é possível deletar: existem produtos vinculados a esta categoria.', 'error')
        return
      }
    } catch (e) {
      // se falhar ao buscar produtos, apenas logamos e seguimos para confirmar
      // (a tentativa de delete seguirá e pode retornar erro do backend)
      // eslint-disable-next-line no-console
      console.error('Erro ao verificar produtos vinculados', e)
    }

    const ok = await confirm('Deseja deletar esta categoria?')
    if (!ok) return
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.show('Categoria deletada com sucesso.', 'success')
    } catch (err) {
      const message = (err as any)?.response?.data?.message || (err as any)?.message || 'Erro ao deletar categoria.'
      toast.show(message, 'error')
    }
  }

  if (loading) return <p>Carregando...</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <div>
          <h1 className="section-title">Categorias</h1>
          <p className="section-subtitle">Organize as categorias do cardápio</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          + Nova Categoria
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="table-cell text-left font-semibold text-gray-700">Nome</th>
                <th className="table-cell text-right font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-medium text-gray-900">{category.name}</td>
                  <td className="table-cell text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleOpenEdit(category)}
                        className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-panel flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <p className="section-subtitle mt-1">
                {editing ? 'Atualize o nome desta categoria' : 'Crie uma nova categoria para o cardápio'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories