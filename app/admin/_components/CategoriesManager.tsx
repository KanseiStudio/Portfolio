"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Trash2, X, Check, Plus } from "lucide-react"
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/validations/project"
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/_actions/categories"

interface CategoryRow {
  id: number
  slug: string
  sortOrder: number
  nameIt: string
  nameEn: string
  projectCount: number
}

interface CategoriesManagerProps {
  categories: CategoryRow[]
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[àáâã]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõ]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function inputCls(hasError?: boolean) {
  return `w-full border ${hasError ? "border-red-400" : "border-ks-hairline-active"} bg-transparent px-2 py-1.5 text-small font-body focus:outline-none focus:border-ks-fg/40 transition-colors`
}

interface CategoryRowFormProps {
  defaultValues?: Partial<CategoryFormValues>
  onSubmit: (data: CategoryFormValues) => Promise<void>
  onCancel?: () => void
  submitLabel: string
  isInline?: boolean
}

function CategoryRowForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
  isInline,
}: CategoryRowFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { slug: "", sortOrder: 0 as number, nameIt: "", nameEn: "", ...defaultValues } as CategoryFormValues,
  })

  const nameIt = watch("nameIt")

  function autoSlug() {
    if (nameIt) setValue("slug", slugify(nameIt), { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={`grid gap-2 ${isInline ? "grid-cols-[1fr_1fr_1fr_auto_auto_auto]" : "grid-cols-1"} items-start`}>
        <div>
          <input
            {...register("nameIt")}
            placeholder="Nome IT"
            className={inputCls(!!errors.nameIt)}
            onBlur={autoSlug}
          />
          {errors.nameIt && <p className="text-xs text-red-600 mt-0.5">{errors.nameIt.message}</p>}
        </div>

        <div>
          <input
            {...register("nameEn")}
            placeholder="Nome EN"
            className={inputCls(!!errors.nameEn)}
          />
          {errors.nameEn && <p className="text-xs text-red-600 mt-0.5">{errors.nameEn.message}</p>}
        </div>

        <div>
          <input
            {...register("slug")}
            placeholder="slug"
            className={inputCls(!!errors.slug)}
          />
          {errors.slug && <p className="text-xs text-red-600 mt-0.5">{errors.slug.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="p-1.5 bg-ks-fg text-ks-bg hover:bg-ks-fg/80 transition-colors disabled:opacity-50"
          title={submitLabel}
        >
          <Check size={14} strokeWidth={1.5} />
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 border border-ks-hairline-active hover:bg-ks-fg/5 transition-colors"
            title="Annulla"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </form>
  )
}

export function CategoriesManager({ categories: initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleCreate(data: CategoryFormValues) {
    setError(null)
    const result = await createCategoryAction(data)
    if (result?.error) {
      setError(result.error)
      return
    }
    // Optimistically add — page will revalidate on next load
    setCategories((prev) => [
      ...prev,
      {
        id: Date.now(), // temp id — page will reload
        slug: data.slug,
        sortOrder: data.sortOrder,
        nameIt: data.nameIt,
        nameEn: data.nameEn,
        projectCount: 0,
      },
    ])
    setShowCreate(false)
    // Trigger router refresh via a lightweight approach
    window.location.reload()
  }

  async function handleUpdate(id: number, data: CategoryFormValues) {
    setError(null)
    const result = await updateCategoryAction(id, data)
    if (result?.error) {
      setError(result.error)
      return
    }
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, slug: data.slug, sortOrder: data.sortOrder, nameIt: data.nameIt, nameEn: data.nameEn }
          : c
      )
    )
    setEditingId(null)
  }

  function handleDelete(id: number, name: string) {
    if (!confirm(`Eliminare la categoria "${name}"? L'azione è irreversibile.`)) return
    startTransition(async () => {
      const result = await deleteCategoryAction(id)
      if (result?.error) {
        setError(result.error)
        return
      }
      setCategories((prev) => prev.filter((c) => c.id !== id))
    })
  }

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      {error && (
        <div className="border border-red-200 bg-red-50 p-3 text-small text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Header row */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2 px-1">
        {["Nome IT", "Nome EN", "Slug", ""].map((h) => (
          <span key={h} className="text-eyebrow font-mono uppercase tracking-widest text-xs opacity-50">
            {h}
          </span>
        ))}
      </div>

      {/* Category rows */}
      <div className="border border-ks-hairline-active divide-y divide-ks-hairline-active">
        {categories.length === 0 && (
          <div className="p-4 text-small opacity-60">Nessuna categoria.</div>
        )}

        {categories.map((cat) => (
          <div key={cat.id} className="p-3">
            {editingId === cat.id ? (
              <CategoryRowForm
                defaultValues={{
                  slug: cat.slug,
                  sortOrder: cat.sortOrder,
                  nameIt: cat.nameIt,
                  nameEn: cat.nameEn,
                }}
                onSubmit={(data) => handleUpdate(cat.id, data)}
                onCancel={() => setEditingId(null)}
                submitLabel="Salva"
                isInline
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 flex-1 items-center">
                  <span className="text-small font-medium">{cat.nameIt}</span>
                  <span className="text-small opacity-70">{cat.nameEn}</span>
                  <span className="font-mono text-eyebrow opacity-50">{cat.slug}</span>
                </div>
                <span className="text-eyebrow font-mono opacity-30 text-xs">
                  {cat.projectCount}p
                </span>
                <button
                  onClick={() => setEditingId(cat.id)}
                  className="p-1.5 hover:bg-ks-fg/10 rounded transition-colors opacity-50 hover:opacity-100"
                  title="Modifica"
                >
                  <Pencil size={13} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.nameIt)}
                  className="p-1.5 hover:bg-red-50 text-red-700 rounded transition-colors opacity-0 hover:opacity-100"
                  title="Elimina"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create row */}
      <div className="mt-4">
        {showCreate ? (
          <div className="border border-ks-hairline-active p-3">
            <CategoryRowForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              submitLabel="Crea"
              isInline
            />
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-small font-medium border border-ks-hairline-active px-4 py-2 hover:bg-ks-fg/5 transition-colors"
          >
            <Plus size={14} strokeWidth={1.5} />
            Nuova categoria
          </button>
        )}
      </div>
    </div>
  )
}
