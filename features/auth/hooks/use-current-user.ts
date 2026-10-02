'use client'

import {
  useQuery,
} from '@tanstack/react-query'

import {
  currentUserQueryOptions,
} from '../queries/current-user'


export function useCurrentUser() {
  return useQuery(
    currentUserQueryOptions,
  )
}