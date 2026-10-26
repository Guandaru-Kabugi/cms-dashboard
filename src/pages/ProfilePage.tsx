import { fieldError } from '../api/client'
import { useState, type FormEvent } from 'react'
import type { ProfileRequest, ProfileResponse, SocialLinkRequest } from '../api/types'
import { buttonClass } from '../components/ui/button'
import { ErrorAlert, LoadingRows, SuccessAlert } from '../components/ui/Feedback'
import { TextAreaField, TextField } from '../components/ui/Field'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { profiles } from '../hooks/resources'

const emptyProfile: ProfileRequest = {
  name: '',
  role: '',
  pitch: '',
  location: '',
  email: '',
  cvUrl: '',
  socials: [],
}

// The site has one profile. This page creates it the first time, and edits it after that.
export default function ProfilePage() {
  const { data, isLoading, error } = profiles.useList()

  if (isLoading) return <LoadingRows rows={4} />
  if (error) return <ErrorAlert error={error} />

  // After the first save, the list refetches and `existing` becomes the new profile,
  // so the next save is an update instead of another create.
  return <ProfileForm existing={data?.[0]} />
}

function toRequest(p: ProfileResponse): ProfileRequest {
  return {
    name: p.name,
    role: p.role,
    pitch: p.pitch,
    location: p.location ?? '',
    email: p.email,
    cvUrl: p.cvUrl ?? '',
    socials: p.socialLinks.map(({ label, url }) => ({ label, url })),
  }
}

function ProfileForm({ existing }: { existing?: ProfileResponse }) {
  const [form, setForm] = useState<ProfileRequest>(existing ? toRequest(existing) : emptyProfile)
  const create = profiles.useCreate()
  const update = profiles.useUpdate()
  const isPending = create.isPending || update.isPending
  const isSuccess = create.isSuccess || update.isSuccess
  const err = create.error ?? update.error

  function set<K extends keyof ProfileRequest>(key: K, value: ProfileRequest[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    // Hide the old success / error message once you start editing again
    create.reset()
    update.reset()
  }

  function setLink(index: number, key: keyof SocialLinkRequest, value: string) {
    set('socials', form.socials.map((link, i) => (i === index ? { ...link, [key]: value } : link)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (existing) {
      update.mutate({ id: existing.id, body: form })
    } else {
      create.mutate(form)
    }
  }

  const shown = ['name', 'role', 'pitch', 'location', 'email', 'cvUrl', ...form.socials.flatMap((_, i) => [`socials[${i}].label`, `socials[${i}].url`])]

  return (
    <>
      <PageHeader
        title="Profile"
        description={existing ? 'Shown in the hero section and footer of your site.' : 'No profile yet. Fill this in to create it.'}
      />

      <form onSubmit={handleSubmit} className="grid gap-6">
        <ErrorAlert error={err} shownFields={shown} />
        {isSuccess && <SuccessAlert>Profile saved.</SuccessAlert>}

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <TextField label="Name" required value={form.name} onChange={(e) => set('name', e.target.value)} error={fieldError(err, 'name')} />
          <TextField label="Role" required value={form.role} onChange={(e) => set('role', e.target.value)} error={fieldError(err, 'role')} placeholder="Full Stack Developer" />
          <TextField label="Email" required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={fieldError(err, 'email')} />
          <TextField label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} error={fieldError(err, 'location')} placeholder="Nairobi, Kenya" />
          <div className="sm:col-span-2">
            <TextAreaField label="Pitch" required value={form.pitch} onChange={(e) => set('pitch', e.target.value)} error={fieldError(err, 'pitch')} hint={`${form.pitch.length}/255. One or two sentences under your name.`} />
          </div>
          <div className="sm:col-span-2">
            <TextField label="CV URL" value={form.cvUrl} onChange={(e) => set('cvUrl', e.target.value)} error={fieldError(err, 'cvUrl')} placeholder="/cv.pdf" hint="A full URL, or a path on the public site like /cv.pdf" />
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Social links</h2>
            <button type="button" className={buttonClass('secondary', 'sm')} onClick={() => set('socials', [...form.socials, { label: '', url: '' }])}>
              + Add link
            </button>
          </div>

          {form.socials.length === 0 ? (
            <p className="text-sm text-muted">No links yet. They appear in the site's footer.</p>
          ) : (
            <div className="grid gap-3">
              {form.socials.map((link, i) => (
                <div key={i} className="grid items-start gap-3 sm:grid-cols-[10rem_1fr_auto]">
                  <TextField label="Label" value={link.label} onChange={(e) => setLink(i, 'label', e.target.value)} error={fieldError(err, `socials[${i}].label`)} placeholder="GitHub" />
                  <TextField label="URL" value={link.url} onChange={(e) => setLink(i, 'url', e.target.value)} error={fieldError(err, `socials[${i}].url`)} placeholder="https://github.com/you" />
                  <button
                    type="button"
                    className={`${buttonClass('ghost', 'sm')} sm:mt-7`}
                    onClick={() => set('socials', form.socials.filter((_, j) => j !== i))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div>
          <button type="submit" className={buttonClass()} disabled={isPending}>
            {isPending ? 'Saving…' : existing ? 'Save changes' : 'Create profile'}
          </button>
        </div>
      </form>
    </>
  )
}
