import { Link } from 'react-router-dom'
import { buttonClass } from '../components/ui/button'
import { EmptyState, ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { posts } from '../hooks/resources'
import { formatDate } from '../lib/utils'

export default function PostsPage() {
  const { data, isLoading, error } = posts.useList()
  const remove = posts.useDelete()

  function handleDelete(id: number, title: string) {
    if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
      remove.mutate(id)
    }
  }

  return (
    <>
      <PageHeader
        title="Posts"
        description="The latest three appear on the landing page."
        actions={
          <Link to="/posts/new" className={buttonClass()}>
            New post
          </Link>
        }
      />

      <div className="grid gap-4">
        <ErrorAlert error={error ?? remove.error} />

        {isLoading ? (
          <LoadingRows />
        ) : data?.length === 0 ? (
          <EmptyState title="No posts yet">
            <Link to="/posts/new" className="text-accent hover:underline">
              Write your first post
            </Link>
          </EmptyState>
        ) : (
          data && (
            <Card>
              <ul className="divide-y divide-line">
                {data.map((post) => (
                  <li key={post.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                    <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                      <Link to={`/posts/${post.id}`} className="font-medium hover:text-accent">
                        {post.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-xs text-muted">/{post.slug}</p>
                      {post.excerpt && <p className="mt-1 line-clamp-1 text-sm text-muted">{post.excerpt}</p>}
                    </div>
                    <span className="text-xs text-muted">
                      {formatDate(post.publishedAt)} · {post.readingTime} min
                    </span>
                    <div className="flex gap-1">
                      <Link to={`/posts/${post.id}`} className={buttonClass('secondary', 'sm')}>
                        Edit
                      </Link>
                      <button
                        className={buttonClass('ghost', 'sm')}
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={remove.isPending && remove.variables === post.id}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )
        )}
      </div>
    </>
  )
}
