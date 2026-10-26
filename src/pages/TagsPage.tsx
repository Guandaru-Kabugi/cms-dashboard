import { useState, type FormEvent } from 'react'
import type { TagResponse } from '../api/types'
import { buttonClass } from '../components/ui/button'
import { EmptyState, ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import { inputClass } from '../components/ui/Field'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { tags } from '../hooks/resources'

export default function TagsPage() {
  const { data, isLoading, error } = tags.useList()
  const create = tags.useCreate()
  const remove = tags.useDelete()
  const [name, setName] = useState('')

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    create.mutate({ name: name.trim() }, { onSuccess: () => setName('') })
  }

  function handleDelete(tag: TagResponse) {
    if (window.confirm(`Delete the "${tag.name}" tag?`)) {
      remove.mutate(tag.id)
    }
  }

  return (
    <>
      <PageHeader title="Tags" description="Shared by posts and projects. Tags are also created automatically when you save one." />

      <div className="grid gap-4">
        {/* A tag still used by a post or project can't be deleted: the API answers 409 */}
        <ErrorAlert error={error ?? create.error ?? remove.error} />

        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              create.reset()
            }}
            placeholder="New tag name"
            aria-label="New tag name"
            className={`${inputClass} max-w-xs`}
          />
          <button type="submit" className={buttonClass()} disabled={!name.trim() || create.isPending}>
            Add tag
          </button>
        </form>

        {isLoading ? (
          <LoadingRows />
        ) : data?.length === 0 ? (
          <EmptyState title="No tags yet" />
        ) : (
          <Card>
            <ul className="divide-y divide-line">
              {data?.map((tag) => (
                <TagRow key={tag.id} tag={tag} onDelete={() => handleDelete(tag)} />
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  )
}

function TagRow({ tag, onDelete }: { tag: TagResponse; onDelete: () => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(tag.name)
  const update = tags.useUpdate()

  function handleSave(e: FormEvent) {
    e.preventDefault()
    update.mutate({ id: tag.id, body: { name: name.trim() } }, { onSuccess: () => setEditing(false) })
  }

  if (editing) {
    return (
      <li className="px-5 py-3">
        <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus aria-label="Tag name" className={`${inputClass} max-w-xs`} />
          <button type="submit" className={buttonClass('primary', 'sm')} disabled={update.isPending}>
            Save
          </button>
          <button
            type="button"
            className={buttonClass('ghost', 'sm')}
            onClick={() => {
              setName(tag.name)
              setEditing(false)
              update.reset()
            }}
          >
            Cancel
          </button>
        </form>
        {update.error && <p className="mt-2 text-xs text-danger">{update.error.message}</p>}
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3">
      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-fg">{tag.name}</span>
      <div className="flex gap-1">
        <button className={buttonClass('secondary', 'sm')} onClick={() => setEditing(true)}>
          Rename
        </button>
        <button className={buttonClass('ghost', 'sm')} onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  )
}
