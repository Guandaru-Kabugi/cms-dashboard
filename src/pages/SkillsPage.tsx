import { fieldError } from '../api/client'
import { useState, type FormEvent } from 'react'
import type { SkillGroupRequest, SkillGroupResponse } from '../api/types'
import { buttonClass } from '../components/ui/button'
import { EmptyState, ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import { TextField } from '../components/ui/Field'
import PageHeader, { Card } from '../components/ui/PageHeader'
import TagInput from '../components/ui/TagInput'
import { skillGroups } from '../hooks/resources'

// Which card is being edited: 'new', a group's id, or nothing
type Editing = 'new' | number | null

export default function SkillsPage() {
  const { data, isLoading, error } = skillGroups.useList()
  const remove = skillGroups.useDelete()
  const [editing, setEditing] = useState<Editing>(null)

  function handleDelete(group: SkillGroupResponse) {
    if (window.confirm(`Delete the "${group.skillGroupName}" group?`)) {
      remove.mutate(group.id)
    }
  }

  return (
    <>
      <PageHeader
        title="Skills"
        description="Grouped skills for the landing page's stack section, in the order you created them."
        actions={
          <button className={buttonClass()} onClick={() => setEditing('new')} disabled={editing === 'new'}>
            New group
          </button>
        }
      />

      <div className="grid gap-4">
        <ErrorAlert error={error ?? remove.error} />

        {editing === 'new' && <SkillGroupForm onDone={() => setEditing(null)} />}

        {isLoading ? (
          <LoadingRows />
        ) : data?.length === 0 && editing !== 'new' ? (
          <EmptyState title="No skill groups yet">Create groups like Frontend, Backend and DevOps.</EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {data?.map((group) =>
              editing === group.id ? (
                <div key={group.id} className="sm:col-span-2">
                  <SkillGroupForm existing={group} onDone={() => setEditing(null)} />
                </div>
              ) : (
                <Card key={group.id} className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2 className="font-mono text-sm tracking-wider text-muted uppercase">{group.skillGroupName}</h2>
                    <div className="flex gap-1">
                      <button className={buttonClass('secondary', 'sm')} onClick={() => setEditing(group.id)}>
                        Edit
                      </button>
                      <button className={buttonClass('ghost', 'sm')} onClick={() => handleDelete(group)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <li key={skill} className="rounded-full bg-sunken px-2.5 py-1 text-xs font-medium">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Card>
              ),
            )}
          </div>
        )}
      </div>
    </>
  )
}

function SkillGroupForm({ existing, onDone }: { existing?: SkillGroupResponse; onDone: () => void }) {
  const [form, setForm] = useState<SkillGroupRequest>({
    group: existing?.skillGroupName ?? '',
    items: existing?.skills ?? [],
  })
  const create = skillGroups.useCreate()
  const update = skillGroups.useUpdate()
  const mutation = existing ? update : create
  const err = mutation.error

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const body = { ...form, group: form.group.trim() }
    if (existing) {
      update.mutate({ id: existing.id, body }, { onSuccess: onDone })
    } else {
      create.mutate(body, { onSuccess: onDone })
    }
  }

  return (
    <Card className="border-accent p-5">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <ErrorAlert error={err} shownFields={['group', 'items']} />
        <TextField label="Group name" required autoFocus value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} error={fieldError(err, 'group')} placeholder="Frontend" />
        <TagInput label="Skills" value={form.items} onChange={(items) => setForm({ ...form, items })} error={fieldError(err, 'items')} placeholder="React, TypeScript…" />
        <div className="flex gap-2">
          <button type="submit" className={buttonClass()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : existing ? 'Save' : 'Create group'}
          </button>
          <button type="button" className={buttonClass('secondary')} onClick={onDone}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  )
}
