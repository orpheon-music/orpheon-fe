import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

import { api } from "./axios"

export function useQueryApi<T>(
  key: string[],
  url: string,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get<T>(url)
      return res.data
    },
    ...options,
  })
}


type Method = "post" | "put" | "patch" | "delete"

interface MutationApiParams<TData, TVariables> {
  method: Method
  url: string
  options?: UseMutationOptions<TData, unknown, TVariables>
}

export function useMutationApi<TData = unknown, TVariables = unknown>({
  method,
  url,
  options,
}: MutationApiParams<TData, TVariables>) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (variables) => {
      const res = await api[method]<TData>(url, variables)
      return res.data
    },
    ...options,
  })
}

