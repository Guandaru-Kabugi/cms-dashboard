import { useState } from 'react'
import { buttonClass } from '../components/ui/button'
import { EmptyState, ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { contactMessages } from '../hooks/resources'
import { formatDateTime } from '../lib/utils'

export default function MessagesPage() {
  const { data, isLoading, error } = contactMessages.useList()
  const remove = contactMessages.useDelete()
  const [openId, setOpenId] = useState<number | null>(null)

  function handleDelete(id: number) {
    if (window.confirm('Delete this message?')) {
      remove.mutate(id)
    }
  }

  return (
    <>
      <PageHeader title="Messages" description="Sent through the contact form on your site. Newest first." />

      <div className="grid gap-4">
        <ErrorAlert error={error ?? remove.error} />

        {isLoading ? (
          <LoadingRows />
        ) : data?.length === 0 ? (
          <EmptyState title="Inbox is empty">Messages from the site's contact form will show up here.</EmptyState>
        ) : (
          <Card>
            <ul className="divide-y divide-line">
              {data?.map((m) => {
                const open = openId === m.id
                return (
                  <li key={m.id}>
                    <button
                      className="flex w-full cursor-pointer flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 text-left hover:bg-sunken"
                      onClick={() => setOpenId(open ? null : m.id)}
                      aria-expanded={open}
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-sm text-muted">{m.email}</span>
                      <span className="ml-auto text-xs text-muted">{formatDateTime(m.created)}</span>
                      {!open && <span className="w-full truncate text-sm text-muted">{m.message}</span>}
                    </button>
                    {open && (
                      <div className="px-5 pb-5">
                        <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                        <div className="mt-4 flex gap-2">
                          <a className={buttonClass('secondary', 'sm')} href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}>
                            Reply by email
                          </a>
                          <button className={buttonClass('ghost', 'sm')} onClick={() => handleDelete(m.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        )}
      </div>
    </>
  )
}
