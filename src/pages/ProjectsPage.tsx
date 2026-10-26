import { Link } from 'react-router-dom'
import { buttonClass } from '../components/ui/button'
import { EmptyState, ErrorAlert, LoadingRows } from '../components/ui/Feedback'
import PageHeader, { Card } from '../components/ui/PageHeader'
import { projects } from '../hooks/resources'
import { formatDate } from '../lib/utils'

export default function ProjectsPage() {
  const { data, isLoading, error } = projects.useList()
  const remove = projects.useDelete()

  function handleDelete(id: number, title: string) {
    if (window.confirm(`Delete "${title}"? This can't be undone.`)) {
      remove.mutate(id)
    }
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Featured projects appear on the landing page."
        actions={
          <Link to="/projects/new" className={buttonClass()}>
            New project
          </Link>
        }
      />

      <div className="grid gap-4">
        <ErrorAlert error={error ?? remove.error} />

        {isLoading ? (
          <LoadingRows />
        ) : data?.length === 0 ? (
          <EmptyState title="No projects yet">
            <Link to="/projects/new" className="text-accent hover:underline">
              Add your first project
            </Link>
          </EmptyState>
        ) : (
          data && (
            <Card>
              <ul className="divide-y divide-line">
                {data.map((project) => (
                  <li key={project.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                    <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/projects/${project.id}`} className="font-medium hover:text-accent">
                          {project.title}
                        </Link>
                        {project.featured && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-fg">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-muted">/{project.slug}</p>
                      {project.tags.length > 0 && (
                        <p className="mt-1 text-xs text-muted">{project.tags.join(' · ')}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted">Updated {formatDate(project.updatedAt)}</span>
                    <div className="flex gap-1">
                      <Link to={`/projects/${project.id}`} className={buttonClass('secondary', 'sm')}>
                        Edit
                      </Link>
                      <button
                        className={buttonClass('ghost', 'sm')}
                        onClick={() => handleDelete(project.id, project.title)}
                        disabled={remove.isPending && remove.variables === project.id}
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
