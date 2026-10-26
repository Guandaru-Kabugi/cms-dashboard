import { fieldError } from '../api/client'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { ProjectRequest, ProjectResponse } from '../api/types'
import { buttonClass } from '../components/ui/button'
import { ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import { CheckboxField, TextAreaField, TextField } from '../components/ui/Field'
import PageHeader, { Card } from '../components/ui/PageHeader'
import TagInput from '../components/ui/TagInput'
import { projects, tags } from '../hooks/resources'
import { emptyToNull, slugify } from '../lib/utils'

// Handles both /projects/new and /projects/:id
export default function ProjectFormPage() {
  const { id } = useParams()
  const projectId = id ? Number(id) : undefined
  const { data, isLoading, error } = projects.useOne(projectId)

  if (projectId !== undefined) {
    if (isLoading) return <LoadingRows rows={5} />
    if (error) return <ErrorAlert error={error} />
  }
  // key resets the form's state if you navigate from one project straight to another
  return <ProjectForm key={projectId ?? 'new'} existing={data} />
}

interface FormState {
  slug: string
  title: string
  summary: string
  featured: boolean
  repoUrl: string
  liveUrl: string
  projectUrl: string
  tags: string[]
}

function toFormState(p?: ProjectResponse): FormState {
  return {
    slug: p?.slug ?? '',
    title: p?.title ?? '',
    summary: p?.summary ?? '',
    featured: p?.featured ?? false,
    repoUrl: p?.repoUrl ?? '',
    liveUrl: p?.liveUrl ?? '',
    projectUrl: p?.projectUrl ?? '',
    tags: p?.tags ?? [],
  }
}

function toRequest(f: FormState): ProjectRequest {
  return {
    ...f,
    title: f.title.trim(),
    summary: f.summary.trim(),
    repoUrl: emptyToNull(f.repoUrl),
    liveUrl: emptyToNull(f.liveUrl),
    projectUrl: emptyToNull(f.projectUrl),
  }
}

function ProjectForm({ existing }: { existing?: ProjectResponse }) {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(() => toFormState(existing))
  // For new projects, the slug follows the title until you edit the slug yourself
  const [slugEdited, setSlugEdited] = useState(Boolean(existing))
  const { data: allTags } = tags.useList()

  const create = projects.useCreate()
  const update = projects.useUpdate()
  const mutation = existing ? update : create
  const err = mutation.error

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugEdited ? f.slug : slugify(title) }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const body = toRequest(form)
    const onSuccess = () => navigate('/projects')
    if (existing) {
      update.mutate({ id: existing.id, body }, { onSuccess })
    } else {
      create.mutate(body, { onSuccess })
    }
  }

  return (
    <>
      <PageHeader title={existing ? 'Edit project' : 'New project'} description={existing && <span className="font-mono">/{existing.slug}</span>} />

      <form onSubmit={handleSubmit} className="grid gap-6">
        <ErrorAlert error={err} shownFields={['slug', 'title', 'summary', 'repoUrl', 'liveUrl', 'projectUrl']} />

        <Card className="grid gap-4 p-5">
          <TextField label="Title" required value={form.title} onChange={(e) => handleTitle(e.target.value)} error={fieldError(err, 'title')} />
          <TextField
            label="Slug"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true)
              set('slug', e.target.value)
            }}
            error={fieldError(err, 'slug')}
            hint="Used in the URL. Lowercase letters, numbers and hyphens."
            className="font-mono"
          />
          <TextAreaField label="Summary" value={form.summary} onChange={(e) => set('summary', e.target.value)} error={fieldError(err, 'summary')} hint={`${form.summary.length}/255. Shown on the project card.`} />
          <TagInput label="Tags" value={form.tags} onChange={(v) => set('tags', v)} suggestions={allTags?.map((t) => t.name)} placeholder="React, Spring Boot…" hint="New tags are created automatically when you save." />
          <CheckboxField label="Featured" description="Show this project on the landing page." checked={form.featured} onChange={(v) => set('featured', v)} />
        </Card>

        <Card className="grid gap-4 p-5">
          <h2 className="text-sm font-semibold">Links</h2>
          <TextField label="Repository URL" type="url" value={form.repoUrl} onChange={(e) => set('repoUrl', e.target.value)} error={fieldError(err, 'repoUrl')} placeholder="https://github.com/…" />
          <TextField label="Live URL" type="url" value={form.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} error={fieldError(err, 'liveUrl')} placeholder="https://…" />
          <TextField label="Project URL" value={form.projectUrl} onChange={(e) => set('projectUrl', e.target.value)} error={fieldError(err, 'projectUrl')} />
        </Card>

        <div className="flex gap-2">
          <button type="submit" className={buttonClass()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : existing ? 'Save changes' : 'Create project'}
          </button>
          <Link to="/projects" className={buttonClass('secondary')}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
