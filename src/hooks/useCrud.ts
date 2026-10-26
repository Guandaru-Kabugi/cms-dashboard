import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

// Every admin resource has the same five endpoints:
//   GET /api/admin/{path}         list
//   GET /api/admin/{path}/{id}    one
//   POST, PUT /{id}, DELETE /{id}
// So instead of writing five hooks per resource by hand, this builds them.
//
//   const projects = createCrudHooks<ProjectResponse, ProjectRequest>('projects')
//   const { data } = projects.useList()

export function createCrudHooks<TResponse extends { id: number }, TRequest>(path: string) {
  const base = `/api/admin/${path}`
  const keys = {
    all: [path] as const,
    one: (id: number) => [path, id] as const,
  }

  function useList() {
    return useQuery({ queryKey: keys.all, queryFn: () => api.get<TResponse[]>(base) })
  }

  function useOne(id: number | undefined) {
    return useQuery({
      queryKey: keys.one(id ?? -1),
      queryFn: () => api.get<TResponse>(`${base}/${id}`),
      enabled: id !== undefined, // don't fetch on the "new" page
    })
  }

  // After any change, mark this resource's cached data as stale so lists refetch.
  // Tags are also invalidated, because saving a post or project can create tags.
  function useInvalidate() {
    const queryClient = useQueryClient()
    return () => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    }
  }

  function useCreate() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: (body: TRequest) => api.post<TResponse>(base, body),
      onSuccess: invalidate,
    })
  }

  function useUpdate() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: ({ id, body }: { id: number; body: TRequest }) => api.put<TResponse>(`${base}/${id}`, body),
      onSuccess: invalidate,
    })
  }

  function useDelete() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: (id: number) => api.delete(`${base}/${id}`),
      onSuccess: invalidate,
    })
  }

  return { useList, useOne, useCreate, useUpdate, useDelete }
}
