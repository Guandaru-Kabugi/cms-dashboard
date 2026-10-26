import { fieldError } from '../api/client'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { PostRequest, PostResponse } from '../api/types'
import { buttonClass } from '../components/ui/button'
import { ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import { TextAreaField, TextField } from '../components/ui/Field'
import PageHeader, { Card } from '../components/ui/PageHeader'
import TagInput from '../components/ui/TagInput'
import { posts, tags } from '../hooks/resources'
import { formatDateTime, slugify } from '../lib/utils'

// Handles both /posts/new and /posts/:id
export default function PostFormPage() {
  const { id } = useParams()
  const postId = id ? Number(id) : undefined
  const { data, isLoading, error } = posts.useOne(postId)

  if (postId !== undefined) {
    if (isLoading) return <LoadingRows rows={5} />
    if (error) return <ErrorAlert error={error} />
  }
  return <PostForm key={postId ?? 'new'} existing={data} />
}

interface FormState {
  slug: string
  title: string
  excerpt: string
  readingMinutes: string // kept as text while typing; converted to a number on submit
  tags: string[]
}

function toFormState(p?: PostResponse): FormState {
  return {
    slug: p?.slug ?? '',
    title: p?.title ?? '',
    excerpt: p?.excerpt ?? '',
    readingMinutes: p ? String(p.readingTime) : '',
    tags: p?.tags ?? [],
  }
}

function toRequest(f: FormState): PostRequest {
  return {
    slug: f.slug,
    title: f.title.trim(),
    excerpt: f.excerpt.trim(),
    readingMinutes: f.readingMinutes === '' ? null : Number(f.readingMinutes),
    tags: f.tags,
  }
}

function PostForm({ existing }: { existing?: PostResponse }) {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(() => toFormState(existing))
  const [slugEdited, setSlugEdited] = useState(Boolean(existing))
  const { data: allTags } = tags.useList()

  const create = posts.useCreate()
  const update = posts.useUpdate()
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
    const onSuccess = () => navigate('/posts')
    if (existing) {
      update.mutate({ id: existing.id, body }, { onSuccess })
    } else {
      create.mutate(body, { onSuccess })
    }
  }

  return (
    <>
      <PageHeader
        title={existing ? 'Edit post' : 'New post'}
        description={existing ? `Published ${formatDateTime(existing.publishedAt)}` : 'Posts are published as soon as they are created.'}
      />

      <form onSubmit={handleSubmit} className="grid gap-6">
        <ErrorAlert error={err} shownFields={['slug', 'title', 'excerpt', 'readingMinutes']} />

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
          <TextAreaField label="Excerpt" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} error={fieldError(err, 'excerpt')} hint={`${form.excerpt.length}/255. The summary shown on post cards.`} />
          <div className="sm:max-w-40">
            <TextField label="Reading time (min)" type="number" min={0} value={form.readingMinutes} onChange={(e) => set('readingMinutes', e.target.value)} error={fieldError(err, 'readingMinutes')} />
          </div>
          <TagInput label="Tags" value={form.tags} onChange={(v) => set('tags', v)} suggestions={allTags?.map((t) => t.name)} placeholder="React, DevOps…" hint="New tags are created automatically when you save." />
        </Card>

        <p className="text-sm text-muted">The post body editor (TipTap) comes later, once the backend stores content.</p>

        <div className="flex gap-2">
          <button type="submit" className={buttonClass()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : existing ? 'Save changes' : 'Publish post'}
          </button>
          <Link to="/posts" className={buttonClass('secondary')}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  )
}
