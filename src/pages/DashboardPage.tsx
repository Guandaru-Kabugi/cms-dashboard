import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { buttonClass } from '../components/ui/button'
import { ErrorAlert } from '../components/ui/Feedback'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { contactMessages, posts, profiles, projects, skillGroups, tags } from '../hooks/resources'
import { formatDateTime } from '../lib/utils'

export default function DashboardPage() {
  const profileQuery = profiles.useList()
  const stats = [
    { label: 'Projects', to: '/projects', query: projects.useList() },
    { label: 'Posts', to: '/posts', query: posts.useList() },
    { label: 'Skill groups', to: '/skills', query: skillGroups.useList() },
    { label: 'Tags', to: '/tags', query: tags.useList() },
    { label: 'Messages', to: '/messages', query: contactMessages.useList() },
  ]
  const latestMessages = contactMessages.useList().data?.slice(0, 3) ?? []

  const offline = profileQuery.error instanceof ApiError && profileQuery.error.status === 0
  const hasProfile = (profileQuery.data?.length ?? 0) > 0

  return (
    <>
      <PageHeader title="Overview" description="Manage the content shown on your public site." />

      <div className="grid gap-6">
        <ApiStatus loading={profileQuery.isLoading} error={profileQuery.error} />

        {offline && <ErrorAlert error={profileQuery.error} />}

        {profileQuery.isSuccess && !hasProfile && (
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">Start with your profile</p>
              <p className="text-sm text-muted">The public site's hero section and footer read from it.</p>
            </div>
            <Link to="/profile" className={buttonClass()}>
              Create profile
            </Link>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, to, query }) => (
            <Link key={label} to={to} className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {query.isLoading ? '…' : query.isError ? '—' : query.data?.length}
              </p>
            </Link>
          ))}
        </div>

        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="text-sm font-semibold">Latest messages</h2>
            <Link to="/messages" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          {latestMessages.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {latestMessages.map((m) => (
                <li key={m.id} className="px-5 py-3">
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted">{formatDateTime(m.created)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

function ApiStatus({ loading, error }: { loading: boolean; error: unknown }) {
  const offline = error instanceof ApiError && error.status === 0
  const [dot, text] = loading
    ? ['bg-muted', 'Checking API…']
    : offline || error
      ? ['bg-danger', offline ? 'API offline' : 'API returned an error']
      : ['bg-green-500', 'API connected · localhost:8081']

  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <span className={`size-2 rounded-full ${dot}`} />
      {text}
    </p>
  )
}
