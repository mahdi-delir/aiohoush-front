'use client'

import {
  useMemo,
} from 'react'

import {
  useCurrentUser,
} from './use-current-user'


export function useAuthorization() {
  const {
    data: currentUser,
  } = useCurrentUser()

  return useMemo(() => {
    const permissions =
      new Set(
        currentUser?.permissions ?? [],
      )

    const groups =
      new Set(
        currentUser?.groups ?? [],
      )

    return {
      hasPermission(
        permission: string,
      ) {
        return permissions.has(
          permission,
        )
      },

      hasAnyPermission(
        required: readonly string[],
      ) {
        return required.some(
          (permission) =>
            permissions.has(
              permission,
            ),
        )
      },

      hasAllPermissions(
        required: readonly string[],
      ) {
        return required.every(
          (permission) =>
            permissions.has(
              permission,
            ),
        )
      },

      isInGroup(
        group: string,
      ) {
        return groups.has(group)
      },

      isInAnyGroup(
        required: readonly string[],
      ) {
        return required.some(
          (group) =>
            groups.has(group),
        )
      },
    }
  }, [currentUser])
}